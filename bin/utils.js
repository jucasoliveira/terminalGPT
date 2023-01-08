const { Configuration, OpenAIApi } = require("openai");
const { encrypt, saveApiKey, getApiKey } = require("./encrypt");
const prompts = require("prompts");
const chalk = require("chalk");
const process = require("process");
const ora = require("ora");

const apiKeyPrompt = async () => {
  let apiKey = getApiKey();

  if (!apiKey) {
    const response = await prompts({
      type: "password",
      name: "apiKey",
      message: "Enter your OpenAI API key:",
      validate: (value) => {
        return value !== "";
      },
    });

    apiKey = response.apiKey;
    saveApiKey(encrypt(apiKey));
  }

  return apiKey;
};

const generateResponse = async (
  apiKey,
  prompt,
  options,
  response,
  context = ""
) => {
  const configuration = new Configuration({
    apiKey,
  });
  const openai = new OpenAIApi(configuration);
  const spinner = ora("Thinking...").start();
  const request = await openai
    .createCompletion({
      model: options.engine || "text-davinci-002",
      prompt: `${context}\n${response.value}`,
      max_tokens: 2048,
      temperature: parseInt(options.temperature) || 0.5,
    })
    .then((response) => {
      spinner.stop();
      return response;
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
    console.error(`${chalk.red("Something went wrong!")}`);
    return "error";
  }

  // map all choices to text
  const getText = request.data.choices.map((choice) => choice.text);

  console.log(`${chalk.cyan("GPT-3: ")}`);
  // console log each character of the text with a delay and then call prompt when it finished
  let i = 0;
  const interval = setInterval(() => {
    if (i < getText[0].length) {
      process.stdout.write(getText[0][i]);
      i++;
    } else {
      clearInterval(interval);
      console.log("\n");
      prompt();
    }
  }, 10);
};

module.exports = {
  apiKeyPrompt,
  generateResponse,
};
