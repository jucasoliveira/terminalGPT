/* eslint-disable @typescript-eslint/no-explicit-any */
import { getPlugins } from "../commands";
import { promptCerebro } from "../utils";
import { addContext, getContext } from "../context";

const determinePlugins = async (
  engine: string,
  apiKey: string,
  userInput: string,
  opts: any
) => {
  // Add user input to context
  addContext({ role: "user", content: userInput });

  // Get relevant context
  const relevantContext = getContext(userInput);

  const plugins = getPlugins();
  const pluginDescriptions = plugins
    .map((p) => `${p.name} (${p.keyword}): ${p.description}`)
    .join("\n");

  const llmPrompt = `
  Given the following user input, conversation context, and available plugins, determine if any plugins should be used. If so, provide the plugin keyword. If no plugins are applicable, respond with "none".
  
  Available plugins:
  ${pluginDescriptions}
  
  Conversation context:
  ${relevantContext.map((item) => `${item.role}: ${item.content}`).join("\n")}
  
  User input: "${userInput}"
  
  Respond with a single plugin keyword or "none".
  `;

  const response = await promptCerebro(engine, apiKey, llmPrompt, opts);

  // Add AI response to context
  addContext({
    role: "assistant",
    content: response?.trim().toLowerCase() ?? "none",
  });

  return response?.trim().toLowerCase() ?? "none";
};

export default determinePlugins;
