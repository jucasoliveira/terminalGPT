const { encrypt, saveApiKey, getApiKey } = require("./encrypt");
const prompts = require("prompts");
const chalk = require("chalk");
const process = require("process");
const { generateCompletion } = require("./gpt");

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

const generateResponse = async (apiKey, prompt, options, response) => {
  try {
    const request = await generateCompletion(
      apiKey,
      options.engine || "text-davinci-002",
      response.value,
      options
    );

    if (request == undefined || !request.data?.choices?.[0].text) {
      throw new Error("Something went wrong!");
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
  } catch (err) {
    console.error(`${chalk.red("1 Something went wrong!!")} ${err}`);
    // create a prompt of type select , with the options to exit or try again
    const response = await prompts({
      type: "select",
      name: "value",
      message: "Try again?",
      choices: [
        { title: "Yes", value: "yes" },
        { title: "No - exit", value: "no" },
      ],
      initial: 0,
    });

    switch (response.value) {
      case "no":
        return process.exit(0);
      case "yes":
      default:
        // call the function again
        generateResponse(apiKey, prompt, options, response);
        break;
    }
  }
};

module.exports = {
  apiKeyPrompt,
  generateResponse,
};
