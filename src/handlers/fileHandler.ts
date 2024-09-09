/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs";
import path from "path";
import { addContext } from "../context";
import chalk from "chalk";

export async function handleFileReference(
  filePath: string,
  userPrompt: string
) {
  try {
    const absolutePath = path.resolve(filePath);
    const fileContent = fs.readFileSync(absolutePath, "utf-8");
    const fileContext = `File content of ${filePath}:\n\n${fileContent}\n\nUser prompt: ${userPrompt}`;
    addContext({ role: "system", content: fileContext });
    console.log(
      chalk.green(
        `File ${filePath} has been added to the conversation context.`
      )
    );
  } catch (error: any) {
    console.error(chalk.red(`Error reading file: ${error.message}`));
  }
}
