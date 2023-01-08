#!/usr/bin/env node

const { Configuration, OpenAIApi } = require("openai");
const commander = require("commander");
const prompts = require("prompts");
const chalk = require("chalk");
const gradient = require("gradient-string");
const process = require("process");
const ora = require("ora");

const { encrypt, saveApiKey, getApiKey } = require("./encrypt");

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

const intro = function () {
  const usageText = `
  ${gradient(
    "cyan",
    "pink"
  )("****************")} Welcome to ${chalk.greenBright(
    "terminalGPT"
  )} ${gradient("cyan", "pink")("****************")}

  ${gradient("orange", "yellow").multiline(
    ["  __", "<(o )___", " ( ._> /", "  `---'"].join("\n")
  )}

  ${chalk.yellowBright("usage:")}
    TerminalGPT will ask you to add your OpenAI API key. Don't worry, it's saves on your machine locally.

    Terminal will prompt you to enter a message. Type your message and press enter.
    Terminal will then prompt you to enter a response. Type your response and press enter.

    To exit, type "${chalk.redBright("exit")}" and press enter.


  `;

  console.log(usageText);
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

commander
  .command("chat")
  .option("-e, --engine <engine>", "GPT-3 model to use")
  .option("-t, --temperature <temperature>", "Response temperature")
  .usage(`"<project-directory>" [options]`)
  .action((options) => {
    intro();
    apiKeyPrompt().then((apiKey) => {
      const prompt = async () => {
        const response = await prompts({
          type: "text",
          name: "value",
          message: `${chalk.blueBright("You: ")}`,
          validate: () => {
            return true;
          },
        });

        switch (response.value) {
          case "exit":
            return process.exit(0);
          case "clear":
            return process.stdout.write("\x1Bc");
          default:
            generateResponse(apiKey, prompt, options, response);
            return;
        }
      };

      prompt();
    });
  });

commander.parse(process.argv);
