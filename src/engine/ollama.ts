import chalk from "chalk";
import { addContext, getContext } from "../context";
import { loadWithRocketGradient } from "../gradient";
import axios from "axios";
import { combineConsecutiveMessages, ensureMessagesAlternate } from "./common";

export const OllamaEngine = async (
  apiKey: string | Promise<string>,
  prompt: string,
  opts: {
    model: string; // Specify the model to use
    temperature: unknown;
  },
  hasContext: boolean = false,
  baseURL: string = "http://localhost:11434"
) => {
  const apiKeyValue = await apiKey;
  const spinner = loadWithRocketGradient("Thinking...").start();

  const relevantContext = getContext(prompt);

  try {
    // Process and combine messages
    let processedMessages = combineConsecutiveMessages(relevantContext);
    processedMessages = ensureMessagesAlternate(processedMessages);

    // Add the current prompt
    processedMessages.push({ role: "user", content: prompt });

    const response = await axios.post(
      `${baseURL}/api/chat`,
      {
        model: opts.model || "llama2", // Use a default model if none is provided
        messages: processedMessages.map((item) => ({
          role: item.role,
          content: item.content,
        })),
        temperature: opts.temperature ? Number(opts.temperature) : 1,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKeyValue}`,
          "Content-Type": "application/json",
        },
      }
    );

    const message = response.data.message?.content;

    if (message) {
      if (hasContext) {
        addContext({ role: "assistant", content: message });
      }
      spinner.stop();
      return message;
    } else {
      throw new Error("Undefined messages received");
    }
  } catch (err) {
    spinner.stop();
    // Error handling remains the same
    if (axios.isAxiosError(err)) {
      console.log(err);
      switch (err.response?.status) {
        case 404:
          throw new Error(
            `${chalk.red(
              "Not Found: Model not found. Please check the model name."
            )}`
          );
        case 429:
          throw new Error(
            `${chalk.red(
              "API Rate Limit Exceeded: Too many requests. Please wait before trying again."
            )}`
          );
        case 400:
          throw new Error(
            `${chalk.red("Bad Request: Prompt provided is empty or too long.")}`
          );
        case 500:
          throw new Error(
            `${chalk.red("Internal Server Error: Please try again later.")}`
          );
        default:
          throw new Error(`${chalk.red("An unknown error occurred")}`);
      }
    } else {
      throw new Error(`${chalk.red("An unknown error occurred")}`);
    }
  }
};
