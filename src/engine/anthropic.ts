/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import AnthropicClient from "@anthropic-ai/sdk";
import { MessageCreateParamsNonStreaming } from "@anthropic-ai/sdk/resources/messages.mjs";
import { addContext, getContext, ContextItem } from "../context";
import { loadWithRocketGradient } from "../gradient";
import chalk from "chalk";

const combineConsecutiveMessages = (messages: ContextItem[]): ContextItem[] => {
  if (messages.length === 0) return messages;

  const combinedMessages: ContextItem[] = [messages[0]];

  for (let i = 1; i < messages.length; i++) {
    const lastMessage = combinedMessages[combinedMessages.length - 1];
    const currentMessage = messages[i];

    if (currentMessage.role === lastMessage.role) {
      lastMessage.content += "\n" + currentMessage.content;
    } else {
      combinedMessages.push(currentMessage);
    }
  }

  return combinedMessages;
};

const ensureMessagesAlternate = (messages: ContextItem[]): ContextItem[] => {
  const alternatingMessages: ContextItem[] = [];

  // Ensure the first message is from the user
  let expectedRole: "user" | "assistant" = "user";

  for (const message of messages) {
    if (message.role !== expectedRole) {
      // Skip or adjust message
      continue; // or handle as needed
    }

    alternatingMessages.push(message);
    expectedRole = expectedRole === "user" ? "assistant" : "user";
  }

  return alternatingMessages;
};

export const AnthropicEngine = async (
  apiKey: string | Promise<string>,
  prompt: string,
  opts: {
    model: string;
    temperature: unknown;
  },
  hasContext: boolean = false
) => {
  const apiKeyValue = await apiKey;

  const anthropic = new AnthropicClient({ apiKey: apiKeyValue });
  const spinner = loadWithRocketGradient("Thinking...").start();

  try {
    const relevantContext = getContext(prompt);

    let messages: ContextItem[] = [];
    let systemMessage = "";

    // Process relevant context
    for (const item of relevantContext) {
      if (item.role === "system") {
        systemMessage += item.content + "\n";
      } else {
        messages.push(item);
      }
    }

    // Combine consecutive messages with the same role
    messages = combineConsecutiveMessages(messages);

    // Ensure messages start with 'user' and roles alternate
    messages = ensureMessagesAlternate(messages);

    // Add the current prompt as a 'user' message
    if (
      messages.length === 0 ||
      messages[messages.length - 1].role !== "user"
    ) {
      messages.push({ role: "user", content: prompt });
    } else {
      messages[messages.length - 1].content += "\n" + prompt;
    }

    const requestParams: MessageCreateParamsNonStreaming = {
      model: opts.model || "claude-3-opus-20240229",
      messages: messages,
      system: systemMessage.trim() || undefined,
      temperature: opts.temperature ? Number(opts.temperature) : 1,
      max_tokens: 1024,
    };

    const response = await anthropic.messages.create(requestParams);
    const message = response.content
      .filter((block) => block.type === "text")
      .map((block) => (block.type === "text" ? block.text : ""))
      .join("\n");

    if (message) {
      if (hasContext) {
        addContext({ role: "user", content: prompt });
        addContext({ role: "assistant", content: message });
      }
      spinner.stop();
      return message;
    } else {
      throw new Error("No text content received in the response");
    }
  } catch (err) {
    spinner.stop();
    if (err instanceof Error) {
      console.error(err);
      throw new Error(`${chalk.red(err.message)}`);
    } else {
      throw new Error(`${chalk.red("An unknown error occurred")}`);
    }
  }
};
