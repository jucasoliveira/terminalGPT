/* eslint-disable @typescript-eslint/no-explicit-any */
import chalk from "chalk";
import { Plugin } from "./index";
import { handleWebResearch } from "../handlers/webHandler";
import { promptResponse } from "../utils";

const scrapperPlugin: Plugin = {
  name: "scrapper",
  keyword: "@scrapper",
  description: "Scrapes / Reads a website and returns the content",
  execute: async (context: {
    userInput: string;
    engine: string;
    apiKey: string;
    opts: any;
  }) => {
    const { userInput, engine, apiKey, opts } = context;
    const url = userInput.slice(5).trim(); // Remove "@scrapper " from the input

    if (url) {
      try {
        const researchResults = await handleWebResearch(url, userInput);
        console.log(chalk.cyan("Web research results:"));
        console.log(researchResults);

        // Use the research results to generate a response
        const enhancedPrompt = `Based on the following web research results, please provide a summary or answer:
        ${researchResults}
        
        User query: ${url}`;

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
      console.log(chalk.yellow("Please provide a URL. Usage: @scrapper <URL>"));
      return "Error: No URL provided";
    }
  },
};

export default scrapperPlugin;
