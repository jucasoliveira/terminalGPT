const { Configuration, OpenAIApi } = require("openai");
const chalk = require("chalk");
const { loadWithRocketGradient } = require("./gradient");
const { getContext, addContext } = require("./context");
const { appendToFile, uploadFile } = require("./file");
const { fineTune, getFineTuneModel, setFineTuneModel } = require("./fineTune");

let converstationLimit = 0;

const checkModel = (options) => {
  return getFineTuneModel() || options.engine || "text-davinci-002";
};

const generateCompletion = async (apiKey, model, prompt, options) => {
  try {
    let innerContext = getContext();
    const tgptModel = `${model}-terminal-gpt`;
    const file = `${__dirname}/../data/${tgptModel}.jsonl`;
    const configuration = new Configuration({
      apiKey,
    });

    const openai = new OpenAIApi(configuration);
    const spinner = loadWithRocketGradient("Thinking...").start();
    addContext(`${prompt}\n`);

    const request = await openai
      .createCompletion({
        model: checkModel(options),
        prompt: `Read the context, analyze and return an answer for the prompt,always wrapping block of code exactly within triple backticks.\nContext:${innerContext}\nPrompt:${prompt}\n`,
        max_tokens: 2048,
        temperature: parseInt(options.temperature) || 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      })
      .then((res) => {
        addContext(`${res.data.choices[0].text}`);
        spinner.stop();
        return res;
      })
      .catch((err) => {
        checkModel(options);
        if (err["response"]["status"] == "404") {
          console.error(
            `${chalk.red(
              "\nNot Found: Model not found. Please check the model name."
            )}`
          );
        }
        if (err["response"]["status"] == "429") {
          console.error(
            `${chalk.red(
              "\nAPI Rate Limit Exceeded: ChatGPT is getting too many requests from the user in a short period of time. Please wait a while before sending another message."
            )}`
          );
        }
        if (err["response"]["status"] == "400") {
          console.error(
            `${chalk.red(
              "\nBad Request: Prompt provided is empty or too long. Prompt should be between 1 and 4096 tokens."
            )}`
          );
        }
        if (err["response"]["status"] == "402") {
          console.error(
            `${chalk.red(
              "\nPayment Required: ChatGPT quota exceeded. Please check you chatGPT account."
            )}`
          );
        }
        if (err["response"]["status"] == "503") {
          console.error(
            `${chalk.red(
              "\nService Unavailable: ChatGPT is currently unavailable, possibly due to maintenance or high traffic. Please try again later."
            )}`
          );
        } else {
          console.error(`${chalk.red("Something went wrong!!!")} ${err}`);
        }

        spinner.stop();
        return "error";
      });

    if (request == undefined || !request.data?.choices?.[0].text) {
      throw new Error("Something went wrong!");
    }

    if (options.finetunning) {
      converstationLimit = converstationLimit + 1;
      appendToFile(file, prompt, request.data.choices[0].text);
      if (converstationLimit === parseInt(options.limit)) {
        const uploadedFile = await uploadFile(apiKey, file);
        const fineTuning = await fineTune(apiKey, uploadedFile.id);
        setFineTuneModel(fineTuning.fine_tuned_model);
        addContext("");
      }
    }
    return request;
  } catch (error) {
    console.error(`${chalk.red("Something went wrong!!")} ${error}`);
  }
};

module.exports = {
  appendToFile,
  generateCompletion,
};
