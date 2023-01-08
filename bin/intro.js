const gradient = require("gradient-string");
const chalk = require("chalk");

const intro = () => {
  const usageText = `
  ${gradient(
    "cyan",
    "pink"
  )("****************")} Welcome to ${chalk.greenBright(
    "terminalGPT"
  )} ${gradient("cyan", "pink")("****************")}

  ${gradient("orange", "yellow").multiline(
    ["  __", "<(o )___", " ( ._> /", "  `---'"].join("\n")
  )}

  ${chalk.yellowBright("usage:")}
    TerminalGPT will ask you to add your OpenAI API key. Don't worry, it's saves on your machine locally.

    Terminal will prompt you to enter a message. Type your message and press enter.
    Terminal will then prompt you to enter a response. Type your response and press enter.

    To exit, type "${chalk.redBright("exit")}" and press enter.


  `;

  console.log(usageText);
};

module.exports = {
  intro,
};
