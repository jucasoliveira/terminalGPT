/* eslint-disable @typescript-eslint/no-explicit-any */
import { getPlugins } from "../commands";
import { promptCerebro } from "../utils";

const determinePlugins = async (
  engine: string,
  apiKey: string,
  userInput: string,
  opts: any
) => {
  const plugins = getPlugins();
  const pluginDescriptions = plugins
    .map((p) => `${p.name} (${p.keyword}): ${p.description}`)
    .join("\n");

  const llmPrompt = `
  Given the following user input and available plugins, determine if any plugins should be used. If so, provide the plugin keyword. If no plugins are applicable, respond with "none".
  
  Available plugins:
  ${pluginDescriptions}
  
  User input: "${userInput}"
  
  Respond with a single plugin keyword or "none".
  `;

  const response = await promptCerebro(engine, apiKey, llmPrompt, opts);

  return response?.trim().toLowerCase() ?? "none";
};

export default determinePlugins;
