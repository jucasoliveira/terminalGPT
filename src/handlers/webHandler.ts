/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { addContext } from "../context";
import chalk from "chalk";
import { saveCredentials, getCredentials } from "../creds";
import readline from "readline";

export async function handleWebResearch(query: string, userPrompt: string) {
  try {
    let credentials = await getCredentials();

    if (!credentials.tavilyApiKey) {
      console.log(chalk.yellow("Tavily API key not found."));
      console.log(
        chalk.cyan("Please visit https://tavily.com to get an API key.")
      );
      const tavilyApiKey = await promptForApiKey();
      saveCredentials(
        credentials.apiKey || "",
        credentials.engine || "",
        credentials.model || "",
        tavilyApiKey
      );
      credentials = getCredentials();
    }
    const tavilyApiKey = credentials.tavilyApiKey!;

    console.log(chalk.yellow(`Searching the web for: "${query}"...`));

    const response = await axios.post("https://api.tavily.com/search", {
      api_key: tavilyApiKey,
      query: query,
      search_depth: "basic",
      max_results: 3,
    });

    const searchResults = response.data.results
      .map(
        (result: any) =>
          `Title: ${result.title}\nContent: ${result.content}\n\n`
      )
      .join("");

    console.log(chalk.cyan("Found Results"));

    const webContext = `Web search results for "${query}":\n\n${searchResults}\n\nUser prompt: ${userPrompt}`;
    addContext({ role: "system", content: webContext });
    console.log(
      chalk.green(
        `Web research results for "${query}" have been added to the conversation context.`
      )
    );
    return webContext;
  } catch (error: any) {
    console.error(chalk.red(`Error performing web research: ${error.message}`));
  }
}

// Update the promptForApiKey function
async function promptForApiKey(): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question("Please enter your Tavily API key: ", (apiKey) => {
      rl.close();
      // Remove encryption here
      resolve(apiKey.trim());
    });
  });
}
