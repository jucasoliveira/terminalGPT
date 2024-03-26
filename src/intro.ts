import chalk from "chalk";

import gradient from "gradient-string";

/**
 * Generates the function comment for the given function body.
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
  **        |  |  Bad command or |  |  |/----|'---=    |      |     **
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
    "terminalGPT"
  )} ${gradient("cyan", "pink")("************************")}
  ${coloredAscii}

  ${chalk.cyanBright(
    "Created by @jucasoliveira: https://github.com/jucasoliveira"
  )}

  ${chalk.cyanBright(
    "TerminalGPT will be maintained by Warpi as Jan 2024. You can check other OS initiavies at:"
  )}

  ${chalk.blueBright("https://github.com/warpy-ai")}


  ${chalk.yellowBright("usage:")}
    TerminalGPT will ask you to add your OpenAI API key. Don't worry, it will be saved(encrypted) on your machine locally.

    Terminal will prompt you to enter a message. Type your message and press enter.
    Terminal will then prompt you to enter a response. Type your response and press enter.

    To exit, type "${chalk.redBright("exit")}" and press enter.

    # Commands
    ${chalk.yellowBright("exit")} - Exit the program
    ${chalk.yellowBright("delete")} - Delete the saved API key
    ${chalk.yellowBright("chat")} - Start a chat
    ${chalk.yellowBright("--markdown")} - Show the response in markdown


  `;

  // eslint-disable-next-line no-undef
  console.log(usageText);
}
