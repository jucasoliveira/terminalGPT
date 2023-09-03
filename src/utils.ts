import * as clipboard from "clipboardy";
import {encrypt, getApiKey, getCustomUrl, saveApiKey} from "./encrypt";
import prompts from "prompts";

import chalk from "chalk";

import * as process from "process";

import {marked} from "marked";

import TerminalRenderer from "marked-terminal";

import generateCompletion from "./gpt";


marked.setOptions({
    renderer: new TerminalRenderer()
});

export async function apiKeyPrompt() {
    let apiKey = getApiKey();

    if (!apiKey) {
        const response = await prompts({
            type: "password",
            name: "apiKey",
            message: "Enter your OpenAI API key:",
            validate: (value) => {
                return value !== "";
            },
        });

        apiKey = response.apiKey;
        saveApiKey(encrypt(response.apiKey));
    }

    return apiKey;
}

async function checkBlockOfCode(text: string) {
    // get all matches of text within ```
    const regex = /```[\s\S]*?```/g;
    const matches = text.match(regex);
    if (matches) {
        const recentTextNoBackticks = matches[0].replace(/```/g, "");
        const response = await prompts({
            type: "confirm",
            name: "copy",
            message: `Copy recent code to clipboard?`,
            initial: true,
        });

        if (response.copy) {
            clipboard.writeSync(recentTextNoBackticks);
        }
    }
}

export async function generateResponse(
    apiKey: string,
    prompt: (() => void),
    response: prompts.Answers<string>,
    opts: {
        engine: string,
        temperature: unknown,
        markdown?: unknown
    }
) {
    try {
        const request = await generateCompletion(
            apiKey,
            response.value,
            opts,
            getCustomUrl()
        );

        if (request === undefined || !request?.content) {
            throw new Error("Undefined request or content");
        }

        // map all choices to text
        const getText = [request.content];

        console.log(`${chalk.cyan("GPT: ")}`);

        if (opts.markdown) {
            const markedText = marked.parse(getText[0]);
            let i = 0;
            const interval = setInterval(() => {
                    if (i < markedText.length) {
                        process.stdout.write(markedText[i]);
                        i++;
                    } else {
                        clearInterval(interval);
                        process.stdout.write('\n'); // Add this line
                        checkBlockOfCode(markedText)
                            .then(prompt)
                    }
                },
                10);
        } else {
            // console log each character of the text with a delay and then call prompt when it finished
            let i = 0;
            const interval = setInterval(() => {
                    if (i < getText[0].length) {
                        process.stdout.write(getText[0][i]);
                        i++;
                    } else {
                        clearInterval(interval);
                        process.stdout.write('\n'); // Add this line
                        checkBlockOfCode(getText[0])
                            .then(prompt)
                    }
                },
                10);
        }
    } catch (err) {
        console.error(`${chalk.red("Something went wrong!!")} ${err}`);
        // create a prompt of type select , with the options to exit or try again
        const response = await prompts({
            type: "select",
            name: "value",
            message: "Try again?",
            choices: [
                {title: "Yes", value: "yes"},
                {title: "No - exit", value: "no"},
            ],
            initial: 0,
        });

        if (response.value == "no") {
            return process.exit(0);
        }

        generateResponse(apiKey, prompt, response, opts);
    }
}
