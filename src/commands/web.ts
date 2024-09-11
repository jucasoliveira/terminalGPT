/* eslint-disable @typescript-eslint/no-explicit-any */
import chalk from "chalk";
import { Plugin } from "./index";
import { handleWebResearch } from "../handlers/webHandler";
import { promptResponse } from "../utils";

const webPlugin: Plugin = {
  name: "web",
  keyword: "@web",
  description: "Performs web research based on the given query",
  execute: async (context: {
    userInput: string;
    engine: string;
    apiKey: string;
    opts: any;
  }) => {
    const { userInput, engine, apiKey, opts } = context;
    const query = userInput.slice(5).trim(); // Remove "@web " from the input

    if (query) {
      try {
        const researchResults = await handleWebResearch(query, userInput);
        console.log(chalk.cyan("Web research results:"));
        console.log(researchResults);

        // Use the research results to generate a response
        const enhancedPrompt = `Based on the following web research results, please provide a summary or answer:
        
        ${researchResults}
        
        User query: ${query}`;

        const response = await promptResponse(
          engine,
          apiKey,
          enhancedPrompt,
          opts
        );
        return response;
      } catch (error) {
        console.error(chalk.red(`Error during web research: ${error}`));
        return `Error: ${error}`;
      }
    } else {
      console.log(
        chalk.yellow("Please provide a search query. Usage: @web <query>")
      );
      return "Error: No search query provided";
    }
  },
};

export default webPlugin;
