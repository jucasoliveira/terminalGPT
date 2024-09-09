import chalk from "chalk";
import { handleWebResearch } from "../handlers/webHandler";
import { promptResponse, apiKeyPrompt } from "../utils";

const webFunc = async (userInput: string) => {
  const creds = await apiKeyPrompt();
  const query = userInput.slice(5).trim();
  if (query) {
    await handleWebResearch(query, userInput);
    if (creds.apiKey != null) {
      await promptResponse(creds.engine, creds.apiKey, userInput, {});
    }
  } else {
    console.log(
      chalk.yellow("Please provide a search query. Usage: @web <query>")
    );
  }
};

export default webFunc;
