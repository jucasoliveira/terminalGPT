//const fs = require("fs");

//const contextFile = `${__dirname}/../data/context-terminal-gpt.txt`;

import {ChatCompletionRequestMessage} from "openai";

let context: ChatCompletionRequestMessage[] = [];

export function addContext(text: ChatCompletionRequestMessage) {
    context = [...context, text];
}

export const getContext = () => context
