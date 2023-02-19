const gradient = require("gradient-string");
const chalk = require("chalk");
const marked = require("marked");

const intro = () => {
  const duck = ` ${gradient("orange", "yellow").multiline(
    ["  __", "<(o )___", " ( ._> /", "  `---'"].join("\n")
  )}`;
  const usageText = `
  ${gradient(
    "cyan",
    "pink"
  )("****************")} Welcome to ${chalk.greenBright(
    "terminalGPT"
  )} ${gradient("cyan", "pink")("****************")}

  ${duck}

  ${chalk.yellowBright("usage:")}
    TerminalGPT will ask you to add your OpenAI API key. Don't worry, it will be saved on your machine locally.

    Terminal will prompt you to enter a message. Type your message and press enter.
    Terminal will then prompt you to enter a response. Type your response and press enter.

    To exit, type "${chalk.redBright("exit")}" and press enter.

    # Commands

  `;

  console.log(usageText);
};

module.exports = {
  intro,
};
