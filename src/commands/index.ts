import exitFunc from "./exit";
import clearFunc from "./clear";
import fileFunc from "./file";
import webFunc from "./web";

export interface Plugin {
  keyword: string;
  execute: (userInput: string) => Promise<void> | void;
}

const plugins: Plugin[] = [];

const registerPlugin = (
  keyword: string,
  execute: (userInput: string) => Promise<void> | void
) => {
  plugins.push({ keyword, execute });
};

export const mapPlugins = (userInput: string): Plugin | undefined => {
  return plugins.find((plugin) => userInput.startsWith(plugin.keyword));
};

export const initializePlugins = () => {
  // Register your plugins here
  registerPlugin("exit", exitFunc);
  registerPlugin("clear", clearFunc);
  registerPlugin("@file", fileFunc);
  registerPlugin("@web", webFunc);
};

export const executeCommand = (userInput: string): boolean => {
  const command = plugins.find((plugin) =>
    userInput.startsWith(plugin.keyword)
  );
  if (command) {
    command.execute(userInput);
    return true;
  }
  return false;
};

export default executeCommand;
