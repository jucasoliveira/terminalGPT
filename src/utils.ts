/* eslint-disable @typescript-eslint/no-explicit-any */
// import * as clipboard from "clipboardy";

import prompts, { PromptObject } from "prompts";

import chalk from "chalk";

import * as process from "process";

import { marked } from "marked";

import TerminalRenderer from "marked-terminal";

import { generateResponse } from "./engine/Engine";
import { encrypt, getCredentials, saveCredentials } from "./creds";

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

  const questions: PromptObject<string>[] = [
    {
      type: "select",
      name: "engine",
      message: "Pick LLM",
      choices: [
        { title: "openAI", value: "openAI" },
        { title: "anthropic", value: "anthropic" },
        { title: "gemini", value: "gemini" },
        { title: "ollama", value: "ollama" },
      ],
      initial: 0,
    },
    {
      type: "password",
      name: "apiKey",
      message: "Enter your OpenAI API key:",
      validate: (value: string) => {
        return value !== "";
      },
    },
  ];

  if (!apiKey || !engine) {
    const response = await prompts(questions);
    // Save both API key and engine
    saveCredentials(encrypt(response.apiKey), response.engine);
    return { apiKey: response.apiKey, engine: response.engine };
  }

  return { apiKey, engine };
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
