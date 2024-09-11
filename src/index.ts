#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-explicit-any */

import chalk from "chalk";
import * as process from "process";
import { Command } from "commander";
import intro from "./intro";
import { apiKeyPrompt, promptCerebro, promptResponse } from "./utils";
import { deleteCredentials } from "./creds";
import readline from "readline";
import {
  getPlugins,
  findPlugin,
  executePlugin,
  initializePlugins,
} from "./commands";

const program = new Command();

const determinePlugins = async (
  engine: string,
  apiKey: string,
  userInput: string,
  opts: any
) => {
  const plugins = getPlugins();
  const pluginDescriptions = plugins
    .map((p) => `${p.name} (${p.keyword}): ${p.description}`)
    .join("\n");

  const llmPrompt = `
Given the following user input and available plugins, determine if any plugins should be used. If so, provide the plugin keyword. If no plugins are applicable, respond with "none".

Available plugins:
${pluginDescriptions}

User input: "${userInput}"

Respond with a single plugin keyword or "none".
`;

  const response = await promptCerebro(engine, apiKey, llmPrompt, opts);

  return response?.trim().toLowerCase() ?? "none";
};

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

        if (creds.apiKey != null) {
          try {
            // Direct plugin call
            const plugin = findPlugin(userInput);
            if (plugin) {
              console.log(chalk.yellow(`Executing plugin: ${plugin.name}`));
              await executePlugin(plugin, { userInput });
            } else {
              // Use LLM to determine if a plugin should be used
              const pluginKeyword = await determinePlugins(
                creds.engine,
                creds.apiKey,
                userInput,
                opts
              );

              if (pluginKeyword !== "none") {
                const plugin = findPlugin(pluginKeyword);
                if (plugin) {
                  console.log(chalk.yellow(`Executing plugin: ${plugin.name}`));
                  await executePlugin(plugin, { userInput });
                } else {
                  console.log(chalk.red(`Plugin not found: ${pluginKeyword}`));
                }
              } else {
                // No plugin applicable, use regular promptResponse
                await promptResponse(
                  creds.engine,
                  creds.apiKey,
                  userInput,
                  opts
                );
              }
            }
          } catch (error) {
            console.error(chalk.red("An error occurred:"), error);
          }
        } else {
          console.log(chalk.red("API key is required for chat functionality."));
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
