#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-explicit-any */

import chalk from "chalk";
import * as process from "process";
import { Command } from "commander";
import intro from "./intro";
import { apiKeyPrompt, checkIsLatestVersion, promptResponse } from "./utils";
import { deleteCredentials } from "./creds";
import readline from "readline";
import { findPlugin, executePlugin, initializePlugins } from "./commands";
import determinePlugins from "./rag";
import multiline from "./multiline";

const program = new Command();

program
  .command("chat")
  .option("-e, --engine <engine>", "LLM to use")
  .option("-t, --temperature <temperature>", "Response temperature")
  .usage(`"<project-directory>" [options]`)
  .action(async (opts) => {
    intro();
    await checkIsLatestVersion();
    const creds = await apiKeyPrompt();

    // Initialize plugins
    initializePlugins();

    const prompt = async () => {
      process.stdout.write(chalk.blueBright("\nYou: "));
      process.stdin.resume();
      process.stdin.setEncoding("utf-8");

      const data = await multiline();

      // process.stdin.once("data", async (data) => {
      const userInput = data.toString().trim();

      if (creds.apiKey != null) {
        try {
          // Direct plugin call
          const plugin = findPlugin(userInput);
          if (plugin) {
            console.log(chalk.yellow(`Executing plugin: ${plugin.name}`));
            await executePlugin(plugin, {
              userInput,
              engine: creds.engine,
              apiKey: creds.apiKey,
              opts: { ...opts, model: creds.model || undefined },
            });
          } else {
            // Use LLM to determine if a plugin should be used
            const pluginKeyword = await determinePlugins(
              creds.engine,
              creds.apiKey,
              userInput,
              { ...opts, model: creds.model || undefined }
            );

            if (pluginKeyword.trim() !== "none") {
              const plugin = findPlugin(pluginKeyword);
              if (plugin) {
                console.log(chalk.yellow(`Executing plugin: ${plugin.name}`));
                await executePlugin(plugin, {
                  userInput,
                  engine: creds.engine,
                  apiKey: creds.apiKey,
                  opts: { ...opts, model: creds.model || undefined },
                });
              } else {
                console.log(chalk.red(`Plugin not found: ${pluginKeyword}`));
              }
            } else {
              // No plugin applicable, use regular promptResponse
              await promptResponse(creds.engine, creds.apiKey, userInput, {
                ...opts,
                model: creds.model || undefined,
              });
            }
          }
        } catch (error) {
          console.error(chalk.red("An error occurred:"), error);
        }
      } else {
        console.log(chalk.red("API key is required for chat functionality."));
      }

      prompt();
      //  });
    };

    prompt();
  });

program
  .command("one-shot <question>")
  .description("Ask a one-shot question and get a quick answer")
  .option("-e, --engine <engine>", "LLM to use")
  .option("-t, --temperature <temperature>", "Response temperature")
  .action(async (question, opts) => {
    await checkIsLatestVersion();
    const creds = await apiKeyPrompt();

    if (creds.apiKey != null) {
      try {
        // Use LLM to determine if a plugin should be used
        const pluginKeyword = await determinePlugins(
          creds.engine,
          creds.apiKey,
          question,
          { ...opts, model: creds.model || undefined }
        );

        if (pluginKeyword !== "none") {
          const plugin = findPlugin(pluginKeyword);
          if (plugin) {
            console.log(chalk.yellow(`Executing plugin: ${plugin.name}`));
            await executePlugin(plugin, {
              userInput: question,
              engine: creds.engine,
              apiKey: creds.apiKey,
              opts: { ...opts, model: creds.model || undefined },
            });
          } else {
            console.log(chalk.red(`Plugin not found: ${pluginKeyword}`));
          }
        } else {
          // No plugin applicable, use regular promptResponse
          await promptResponse(creds.engine, creds.apiKey, question, {
            ...opts,
            model: creds.model || undefined,
          });
        }
      } catch (error) {
        console.error(chalk.red("An error occurred:"), error);
      }
    } else {
      console.log(chalk.red("API key is required for chat functionality."));
    }

    process.exit(0);
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
