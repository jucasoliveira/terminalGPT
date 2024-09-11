import chalk from "chalk";

import gradient from "gradient-string";

/**
 * Displays the introduction message for TerminalGPT.
 *
 * @return {void} No return value.
 */
export default function intro() {
  const asciiArt = `
  ********************************************************************
  ********************************************************************
  ********************************************************************
  **                ,----------------,              ,---------,     **
  **           ,-----------------------,          ,"        ,"|     **
  **         ,"                      ,"|        ,"        ,"  |     **
  **        +-----------------------+  |      ,"        ,"    |     **
  **        |  .-----------------.  |  |     +---------+      |     **
  **        |  |                 |  |  |     | -==----'|      |     **
  **        |  |  W a r p y .    |  |  |     |         |      |     **
  **        |  |  TerminalGPT    |  |  |/----|'---=    |      |     **
  **        |  |  tgpt:>_        |  |  |   ,/|==== ooo |      ;     **
  **        |  |                 |  |  |  // |(((( [33]|    ,"      **
  **        |  '-----------------'  |,' .;'| |((((     |  ,"        **
  **        +-----------------------+  ;;  | |         |,"          **
  **            /_)______________(_/  //'  | +---------+            **
  **    ___________________________/___  ,                          **
  **    /  oooooooooooooooo  .o.  oooo /,   ,'----------- ,'        **
  **    / ==ooooooooooooooo==.o.  ooo= //   ,'-{)B     ,'           **
  **    /_==__==========__==_ooo__ooo=_/'   /___________,'          **
  **    '-----------------------------'                             **
  ********************************************************************
  ********************************************************************
  ********************************************************************`;

  const coloredAscii = gradient("magenta", "cyan").multiline(asciiArt);
  const usageText = `
  ${gradient(
    "cyan",
    "pink"
  )("********************")} Welcome to ${chalk.greenBright(
    "TerminalGPT"
  )} ${gradient("cyan", "pink")("************************")}
  ${coloredAscii}

  ${chalk.cyanBright(
    "Created by @jucasoliveira: https://github.com/jucasoliveira"
  )}

  ${chalk.cyanBright(
    "TerminalGPT is maintained by Warpy as of Jan 2024. Check out other OS initiatives at:"
  )}

  ${chalk.blueBright("https://github.com/warpy-ai")}


  ${chalk.yellowBright("Usage:")}
    TerminalGPT will ask for your API key. It will be encrypted and saved locally.

    Type your message and press enter. TerminalGPT will respond.

    TerminalGPT is enhanced with plugins. To use a plugin, start your message with the plugin keyword (e.g., @web for web search).
    Or you can start chatting and TerminalGPT will suggest plugins based on your message.

    ${chalk.yellowBright("Available Plugins:")}
    ${chalk.cyanBright("@list")} - Lists all available plugins

    ${chalk.yellowBright("Other Commands:")}
    ${chalk.cyanBright("delete")} - Delete the saved API key
    ${chalk.cyanBright("chat")} - Start a new chat session
    ${chalk.cyanBright("--markdown")} - Display the response in markdown format

    To exit, type "${chalk.redBright("exit")}" or use the ${chalk.cyanBright(
    "@exit"
  )} plugin.

  ${chalk.greenBright("Start chatting or use a plugin to begin!")}
  `;

  console.log(usageText);
}
