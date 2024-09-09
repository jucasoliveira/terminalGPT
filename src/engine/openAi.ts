import OpenAI from "openai";
import chalk from "chalk";
import { addContext, getContext } from "../context";
import { loadWithRocketGradient } from "../gradient";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";

export const OpenAIEngine = async (
  apiKey: string | Promise<string>,
  prompt: string,
  opts: {
    model: string;
    temperature: unknown;
  }
) => {
  const apiKeyValue = await apiKey;
  const openai = new OpenAI({ apiKey: apiKeyValue });
  const spinner = loadWithRocketGradient("Thinking...").start();

  try {
    const relevantContext = getContext(prompt);
    const messages: ChatCompletionMessageParam[] = [
      ...relevantContext.map((item) => ({
        role: item.role as "system" | "user" | "assistant",
        content: item.content,
      })),
      { role: "user", content: prompt },
    ];

    const completion = await openai.chat.completions.create({
      model: opts.model || "gpt-4o-2024-08-06",
      messages: messages,
      temperature: opts.temperature ? Number(opts.temperature) : 1,
    });

    const message = completion.choices[0].message;
    addContext({ role: message.role, content: message.content || "" });

    spinner.stop();
    return message.content;
  } catch (err) {
    spinner.stop();
    if (err instanceof Error) {
      console.log(err);
      throw new Error(`${chalk.red(err.message)}`);
    } else {
      throw new Error(`${chalk.red("An unknown error occurred")}`);
    }
  }
};
