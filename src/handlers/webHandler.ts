/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { addContext } from "../context";
import chalk from "chalk";
import { getCredentials, saveCredentials, encrypt, decrypt } from "../creds";
import readline from "readline";

export async function handleWebResearch(query: string, userPrompt: string) {
  try {
    let credentials = getCredentials();

    if (!credentials.tavilyApiKey) {
      console.log(chalk.yellow("Tavily API key not found."));
      console.log(
        chalk.cyan("Please visit https://tavily.com to get an API key.")
      );
      const apiKey = await promptForApiKey();
      const encryptedTavilyApiKey = encrypt(apiKey);
      saveCredentials(
        credentials.apiKey || "",
        credentials.engine || "",
        encryptedTavilyApiKey
      );
      credentials = getCredentials();
    }

    const tavilyApiKey = decrypt(credentials.tavilyApiKey!);

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
          `Title: ${result.title}\nSnippet: ${result.snippet}\n\n`
      )
      .join("");

    console.log(chalk.cyan("Search Results:"));
    console.log(searchResults);

    const webContext = `Web search results for "${query}":\n\n${searchResults}\n\nUser prompt: ${userPrompt}`;
    addContext({ role: "system", content: webContext });
    console.log(
      chalk.green(
        `Web research results for "${query}" have been added to the conversation context.`
      )
    );
  } catch (error: any) {
    console.error(chalk.red(`Error performing web research: ${error.message}`));
  }
}

async function promptForApiKey(): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question("Please enter your Tavily API key: ", (apiKey) => {
      rl.close();
      resolve(encrypt(apiKey.trim()));
    });
  });
}
