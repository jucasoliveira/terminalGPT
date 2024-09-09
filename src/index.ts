#!/usr/bin/env node

import chalk from "chalk";
import * as process from "process";
import { Command } from "commander";
import intro from "./intro";
import { apiKeyPrompt, promptResponse } from "./utils";
import { deleteCredentials } from "./creds";
import readline from "readline";
import { mapPlugins, initializePlugins } from "./commands";

const program = new Command();

program
  .command("chat")
  .option("-e, --engine <engine>", "LLM to use")
  .option("-t, --temperature <temperature>", "Response temperature")
  .usage(`"<project-directory>" [options]`)
  .action(async (opts) => {
    intro();
    const creds = await apiKeyPrompt();

    // Initialize plugins
    initializePlugins();

    const prompt = () => {
      process.stdout.write(chalk.blueBright("\nYou: "));
      process.stdin.resume();
      process.stdin.setEncoding("utf-8");
      process.stdin.once("data", async (data) => {
        const userInput = data.toString().trim();

        const plugin = mapPlugins(userInput);
        if (plugin) {
          await plugin.execute(userInput);
        } else if (creds.apiKey != null) {
          await promptResponse(creds.engine, creds.apiKey, userInput, opts);
        }

        prompt();
      });
    };

    prompt();
  });

program
  .command("delete")
  .description("Delete your API key")
  .action(async () => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question("Are you sure? (yes/no): ", (answer) => {
      if (answer.toLowerCase() === "yes") {
        const apiKeyDeleted = deleteCredentials();
        if (apiKeyDeleted) {
          console.log("API key deleted");
        } else {
          console.log("API key file not found, no action taken.");
        }
      } else {
        console.log("Deletion cancelled");
      }
      rl.close();
      process.exit(0);
    });
  });

program.parse(process.argv);
