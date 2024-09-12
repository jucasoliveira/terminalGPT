import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export const getTerminalGPTLatestVersion = async (): Promise<
  string | undefined
> => {
  try {
    const { stdout } = await execAsync("npm view terminalgpt version");
    return stdout.trim();
  } catch (error) {
    console.error(
      "Error while getting the latest version of TerminalGPT:",
      error
    );
    return undefined;
  }
};
