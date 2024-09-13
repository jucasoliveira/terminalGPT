/* eslint-disable @typescript-eslint/no-explicit-any */
// import * as clipboard from "clipboardy";

import prompts, { PromptObject } from "prompts";

import chalk from "chalk";

import * as process from "process";

import { marked } from "marked";

import TerminalRenderer from "marked-terminal";

import { generateResponse } from "./engine/Engine";
import { encrypt, getCredentials, saveCredentials } from "./creds";
import { getTerminalGPTLatestVersion } from "./version";
import currentPackage from "../package.json";

marked.setOptions({
  // Define custom renderer
  renderer: new TerminalRenderer(),
});

/**
 * Prompts the user for an API key and engine, then saves them.
 *
 * @return {{ apiKey: string, engine: string }} The API key and engine entered by the user.
 */
export async function apiKeyPrompt() {
  const credentials = getCredentials();
  const apiKey = credentials?.apiKey;
  const engine = credentials?.engine;
  const model = credentials?.model;

  const questions: PromptObject<string>[] = [
    {
      type: "select",
      name: "engine",
      message: "Pick LLM",
      choices: [
        { title: "OpenAI", value: "openAI" },
        { title: "Anthropic", value: "anthropic" },
        { title: "Gemini", value: "gemini" },
        { title: "Ollama", value: "ollama" },
      ],
      initial: 0,
    },
    {
      type: (prev) => (prev === "ollama" ? null : "password"),
      name: "apiKey",
      message: (prev) => `Enter your ${prev} API key:`,
      validate: (value: string) => value !== "",
    },
    {
      type: (prev, values) => (values.engine === "ollama" ? null : "select"),
      name: "model",
      message: "Select model",
      choices: (prev, values) => {
        switch (values.engine) {
          case "openAI":
            return [
              { title: "GPT-3.5-turbo", value: "gpt-3.5-turbo" },
              { title: "GPT-4", value: "gpt-4" },
              { title: "GPT-4o", value: "gpt-4o" },
              { title: "GPT-o1 Preview", value: "o1-preview" },
              { title: "GPT-4o Mini", value: "gpt-4o-mini" },
              { title: "GPT-o1 Mini", value: "o1-mini" },
            ];
          case "anthropic":
            return [
              { title: "Claude 2", value: "claude-2" },
              { title: "Claude 3 Opus", value: "claude-3-opus-20240229" },
              { title: "Claude 3 Sonnet", value: "claude-3-sonnet-20240229" },
            ];
          case "gemini":
            return [{ title: "Gemini Pro", value: "gemini-pro" }];
          default:
            return [];
        }
      },
    },
  ];

  if (!apiKey || !engine || !model) {
    const response = await prompts(questions);
    // Save API key, engine, and model
    saveCredentials(encrypt(response.apiKey), response.engine, response.model);
    return {
      apiKey: response.apiKey,
      engine: response.engine,
      model: response.model,
    };
  }

  return { apiKey, engine, model };
}

/**
 * Checks a block of code for matches and prompts the user to copy the code to the clipboard.
 *
 * @param {string} text - The text to search for matches within ``` code blocks.
 * @return {void} This function does not return a value.
 */
// async function checkBlockOfCode(text: string) {
//   // get all matches of text within ```
//   const regex = /```[\s\S]*?```/g;
//   const matches = text.match(regex);
//   if (matches) {
//     const recentTextNoBackticks = matches[0].replace(/```/g, "");
//     const response = await prompts({
//       type: "confirm",
//       name: "copy",
//       message: `Copy recent code to clipboard?`,
//       initial: true,
//     });

//     if (response.copy) {
//       clipboard.writeSync(recentTextNoBackticks);
//     }
//   }
// }

/**
 * Generates a response based on the given API key, prompt, response, and options.
 *
 * @param {string} engine - The engine to use for generating the response.
 * @param {() => void} prompt - The function to prompt the user.
 * @param {prompts.Answers<string>} response - The user's response.
 * @param {{ temperature?: number; markdown?: boolean; model: string; }} opts - The options for generating the response.
 * @return {Promise<void>} A promise that resolves when the response is generated.
 */
export const promptResponse = async (
  engine: string,
  apiKey: string,
  userInput: string,
  opts: any
): Promise<void> => {
  try {
    const request = await generateResponse(
      engine,
      apiKey,
      userInput,
      {
        model: opts.model,
        temperature: opts.temperature,
      },
      true
    );

    const text = request ?? "";

    if (!text) {
      throw new Error("Undefined request or content");
    }

    console.log(`${chalk.cyan("Answer: ")}`);

    const markedText = marked.parse(text);
    for (let i = 0; i < markedText.length; i++) {
      process.stdout.write(markedText[i]);
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
  } catch (err) {
    console.error(`${chalk.red("Something went wrong!!")} ${err}`);
    // Error handling remains the same
    // ...
  }
};

export const promptCerebro = async (
  engine: string,
  apiKey: string,
  userInput: string,
  opts: any
) => {
  try {
    const request = await generateResponse(
      engine,
      apiKey,
      userInput,
      {
        model: opts.model,
        temperature: opts.temperature,
      },
      false
    );

    const text = request ?? "";

    if (!text) {
      throw new Error("Undefined request or content");
    }

    return text;
  } catch (err) {
    console.error(`${chalk.red("Something went wrong!!")} ${err}`);
    // Error handling remains the same
    // ...
  }
};

export const checkIsLatestVersion = async () => {
  const latestVersion = await getTerminalGPTLatestVersion();

  if (latestVersion) {
    const currentVersion = currentPackage.version;

    if (currentVersion !== latestVersion) {
      console.log(
        chalk.yellow(
          `
    You are not using the latest stable version of TerminalGPT with new features and bug fixes.
    Current version: ${currentVersion}. Latest version: ${latestVersion}.
    🚀 To update run: npm i -g terminalgpt@latest.
    Or run @update to update the package.
        `
        )
      );
    }
  }
};
