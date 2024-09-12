import { Plugin } from "./index";

const clearPlugin: Plugin = {
  name: "clear",
  keyword: "@clear",
  description: "Clears the terminal screen",
  execute: async () => {
    process.stdout.write("\x1Bc");
    return "Terminal screen cleared.";
  },
};

export default clearPlugin;
