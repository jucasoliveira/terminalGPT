import chalk from "chalk";

import gradient from "gradient-string";

/**
 * Displays the introduction message for TerminalGPT.
 *
 * @return {void} No return value.
 */
export default async function intro() {
  const asciiArt = `
                                          
                                                                                
                                     ddiiidd                                    
                                 6diiiiiiiiiiid0                                
                             dddiiiiiiiiiiiiiiiiidd0                            
                          ddiiiiiiiidiiiiiiiidiiiiiiid0                         
                      ddiiiiiiiiiiiiiidiiiiiiiiiiiiiiiiiidd                     
                     0ddiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiid                    
                     00000ddiiiiiiiiiiiiiiiiiiiiiiiiiidiiiid                    
                     0d0000000diiiiiiiiiiiiiiiiiiidddiiiiiid                    
                     0d0000000000ddiiiidiiiiiiddddiiididiidd                    
                     0000000000000000ddiiiiddddiddddiiiiiiid                    
                     0d00000000000000000ddddddiddiidiiiiiiid                    
                     0d00000000000000000ddddddidddididiiiiid                    
                     0000000000000000000dddddddiiddiiiidiiid                    
                     0000000000000000000dddddddddiddiiiiiiid                    
                     0d00000000000000000dddddiiddiididiiiidd                    
                     0d00000000000000000dddddddiddidiiidiiid                    
                     0000000000000000000dddddddiddidiiiiiiid                    
                      000000000000000000ddddddiddiddiddiidd                     
                         000000000000000dddddiddiddiiidd                        
                           6000000000000dddddddiddidd                           
                               000000000dddddddid0                              
                                  000000ddddddd                                 
                                     000dddd                                    
 `;

  const coloredAscii = gradient("magenta", "cyan").multiline(asciiArt);
  const usageText = `
 
  ${coloredAscii}
  Welcome to ${chalk.greenBright("TerminalGPT")} 
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

  ${chalk.greenBright(
    "Start chatting, or use a plugin to begin! Use shift+enter to finish your message, ctrl+c to exit."
  )}
  `;

  console.log(usageText);
}
