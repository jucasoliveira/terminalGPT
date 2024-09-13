import { Plugin } from "./index";
import chalk from "chalk";

const exitPlugin: Plugin = {
  name: "exit",
  keyword: "@exit",
  description: "Exits the application",
  execute: async () => {
    console.log(chalk.yellow("Goodbye!"));
    process.exit(0);
  },
};

export default exitPlugin;
