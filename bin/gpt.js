const { Configuration, OpenAIApi } = require("openai");
const chalk = require("chalk");
const fs = require("fs");
const { loadWithRocketGradient } = require("./gradient");

const appendToFile = (file, message, response) => {
  // find file, if not , create it
  // append to file with the structure {"prompt": messge, "completion": response}

  // check if file exists
  if (fs.existsSync(file)) {
    // read file
    const data = fs.readFileSync(file, "utf8");
    // parse data
    const parsedData = JSON.parse(data);
    // append to data
    parsedData.push({ prompt: message, completion: response });
    // write to file
    fs.writeFileSync(file, JSON.stringify(parsedData));
  } else {
    // create file
    fs.writeFileSync(
      file,
      JSON.stringify([{ prompt: message, completion: response }])
    );
  }

  return;
};

let context = "";

const addContext = (text) => {
  context = `${context}\n${text}`;
};

const getContext = () => {
  return context;
};

const generateCompletion = async (apiKey, model, prompt, options) => {
  try {
    let innerContext = getContext();
    const tgptModel = `${model}-terminal-gpt`;
    const file = `${__dirname}/../data/${tgptModel}.json`;
    const configuration = new Configuration({
      apiKey,
    });

    const openai = new OpenAIApi(configuration);
    const spinner = loadWithRocketGradient("Thinking...").start();
    const request = await openai
      .createCompletion({
        model: options.engine || "text-davinci-002",
        prompt: `${innerContext}\n${prompt}`,
        max_tokens: 2048,
        temperature: parseInt(options.temperature) || 0.5,
      })
      .then((res) => {
        spinner.stop();
        return res;
      })
      .catch((err) => {
        if (err["response"]["status"] == "429") {
          console.error(
            `${chalk.red(
              "\nChat GPT is having too many requests, wait and send it again."
            )}`
          );
        } else {
          console.error(`${chalk.red("Something went wrong!!")} ${err}`);
        }

        spinner.stop();
        return "error";
      });

    if (request == undefined || !request.data?.choices?.[0].text) {
      throw new Error("Something went wrong!");
    }

    appendToFile(file, prompt, request.data.choices[0].text);
    // const getTrainingModel = await trainModel(apiKey, file, tgptModel);

    addContext(request.data.choices[0].text);
    return request;
  } catch (error) {
    console.error(`${chalk.red("Something went wrong!!")} ${error}`);
  }
};

module.exports = {
  appendToFile,
  generateCompletion,
};
