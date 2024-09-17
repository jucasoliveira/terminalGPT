import readline from "readline";

// Function to prompt for multiline input
function promptMultilineInput() {
  return new Promise((resolve) => {
    let multilineInput = "";
    console.log(
      "Enter your text (to finish enter an empty line, Ctrl+D to submit, Ctrl+C to exit):\n"
    );

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true,
    });

    rl.on("line", (line) => {
      multilineInput += line + "\n";
    });

    rl.on("close", () => {
      resolve(multilineInput);
    });
  });
}

// Main function to loop input
export default async function multiline(): Promise<string> {
  const input = await promptMultilineInput();
  //  console.log("\nYou entered:\n", input);
  return input as string;
}
