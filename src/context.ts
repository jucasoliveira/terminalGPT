/* eslint-disable @typescript-eslint/no-explicit-any */
//const fs = require("fs");

//const contextFile = `${__dirname}/../data/context-terminal-gpt.txt`;

let context: any[] = [];

/**
 * Adds a new context to the existing context array.
 *
 * @param {any} text - The text to be added to the context array.
 */
export function addContext(text: any) {
  context = [...context, text];
}

export const getContext = () => context;
