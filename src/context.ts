/* eslint-disable @typescript-eslint/no-explicit-any */
//const fs = require("fs");

//const contextFile = `${__dirname}/../data/context-terminal-gpt.txt`;

let context: any[] = [];

export function addContext(text: any) {
  context = [...context, text];
}

export const getContext = () => context;
