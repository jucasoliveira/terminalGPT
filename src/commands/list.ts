import chalk from "chalk";
import { Plugin } from "./index";
import { getPlugins } from "./index";

const listPlugin: Plugin = {
  name: "list",
  keyword: "@list",
  description: "Lists all available plugins",
  execute: async () => {
    console.log(chalk.cyan("Available plugins:"));
    const plugins = getPlugins();
    plugins.forEach((plugin) => {
      console.log(
        chalk.cyan(
          `- ${plugin.name} : ${plugin.description} : ${plugin.keyword}`
        )
      );
    });
  },
};

export default listPlugin;
