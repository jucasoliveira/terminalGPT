import chalk from "chalk";
import { addContext, getContext } from "../context";
import { loadWithRocketGradient } from "../gradient";
import axios from "axios";

export const OllamaEngine = async (
  apiKey: string | Promise<string>,
  prompt: string,
  opts: {
    model: string; // Specify the model to use
    temperature: unknown;
  }
) => {
  const apiKeyValue = await apiKey;
  const spinner = loadWithRocketGradient("Thinking...").start();

  const relevantContext = getContext(prompt);

  try {
    const response = await axios.post(
      `http://localhost:11434/api/chat`, // Replace with the actual Ollama API endpoint
      {
        model: opts.model || "llama2", // Use a default model if none is provided
        messages: [
          ...relevantContext.map((item) => ({
            role: item.role,
            content: item.content,
          })),
          { role: "user", content: prompt },
        ],
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
      addContext({ role: "assistant", content: message });
      spinner.stop();
      return message;
    } else {
      throw new Error("Undefined messages received");
    }
  } catch (err) {
    spinner.stop();
    // Handle errors similarly to OpenAI
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
