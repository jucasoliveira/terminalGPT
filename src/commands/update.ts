/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// execute the command to update the package
import { execSync } from "child_process";
import { Plugin } from "./index";

const update: Plugin = {
  name: "update",
  keyword: "@update",
  description: "Update the package",
  execute: async (context: {
    userInput: string;
    engine: string;
    apiKey: string;
    opts: any;
  }) => {
    console.log("Updating the package");
    execSync("npm install -g terminalgpt");
    console.log("Package updated");
  },
};

export default update;
