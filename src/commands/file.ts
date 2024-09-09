import chalk from "chalk";
import { handleFileReference } from "../handlers/fileHandler"; // Assuming this function exists
import { apiKeyPrompt, promptResponse } from "../utils"; // Assuming this function exists

const fileFunc = async (userInput: string) => {
  const creds = await apiKeyPrompt();
  // we need to call file handler here
  const [, filePath, ...promptParts] = userInput.split(" ");
  const promptText = promptParts.join(" ");
  if (filePath) {
    await handleFileReference(filePath, promptText);
    if (creds.apiKey != null) {
      await promptResponse(creds.engine, creds.apiKey, userInput, {});
    }
  } else {
    console.log(
      chalk.yellow("Please provide a file path. Usage: @file <path> [prompt]")
    );
  }
};

export default fileFunc;
