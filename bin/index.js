#!/usr/bin/env node

const commander = require("commander");
const prompts = require("prompts");
const chalk = require("chalk");
const process = require("process");

const { intro } = require("./intro");
const { apiKeyPrompt, generateResponse } = require("./utils");

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
