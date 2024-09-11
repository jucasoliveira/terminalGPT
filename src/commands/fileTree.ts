/* eslint-disable @typescript-eslint/no-explicit-any */
import * as fs from "fs";
import * as path from "path";
import { Plugin } from "./index";

const fileScannerPlugin: Plugin = {
  name: "fileScanner",
  keyword: "@filetree",
  description: "Scans the project directory and returns important files",
  execute: async () => {
    const projectRoot = process.cwd();
    const importantFiles = [
      "package.json",
      "README.md",
      "tsconfig.json",
      ".gitignore",
    ];
    const result: { path: string; content: string }[] = []; // Specify the type here

    for (const file of importantFiles) {
      const filePath = path.join(projectRoot, file);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, "utf-8");
        result.push({ path: file, content });
      }
    }

    console.log("File tree scan result:", result);
    return result;
  },
};

export default fileScannerPlugin;
