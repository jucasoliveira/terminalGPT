/* eslint-disable @typescript-eslint/no-explicit-any */
import chalk from "chalk";
import { Plugin } from "./index";
import { handleFileReference } from "../handlers/fileHandler"; // Assuming this function exists
import { promptResponse } from "../utils"; // Assuming this function exists

const filePlugin: Plugin = {
  name: "file",
  keyword: "@file",
  description: "Handles file operations and references",
  execute: async (context: {
    userInput: string;
    engine: string;
    apiKey: string;
    opts: any;
  }) => {
    const { userInput, engine, apiKey, opts } = context;
    const [, filePath, ...promptParts] = userInput.split(" ");
    const promptText = promptParts.join(" ");

    if (filePath) {
      try {
        await handleFileReference(filePath, promptText);
        const response = await promptResponse(engine, apiKey, userInput, opts);
        return response;
      } catch (error) {
        console.error(chalk.red(`Error handling file: ${error}`));
        return `Error: ${error}`;
      }
    } else {
      console.log(
        chalk.yellow("Please provide a file path. Usage: @file <path> [prompt]")
      );
      return "Error: No file path provided";
    }
  },
};

export default filePlugin;
