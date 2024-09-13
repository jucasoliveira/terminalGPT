import { ContextItem } from "../context";

export const combineConsecutiveMessages = (
  messages: ContextItem[]
): ContextItem[] => {
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

export const ensureMessagesAlternate = (
  messages: ContextItem[]
): ContextItem[] => {
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
