#!/usr/bin/env node

import chalk from "chalk";
import process from "process";
import prompts from "prompts";

import intro from "./intro";

import {apiKeyPrompt, generateResponse} from "./utils";

import {deleteApiKey, saveCustomUrl} from "./encrypt";

import * as c from "commander";

const commander = new c.Command()
commander
    .command("chat")
    .option("-e, --engine <engine>", "GPT model to use")
    .option("-t, --temperature <temperature>", "Response temperature")
    .option("-m, --markdown", "Show markdown in the terminal")
    .usage(`"<project-directory>" [options]`)
    .action(async (opts) => {
        intro();
        apiKeyPrompt()
            .then((apiKey: string | null) => {
                const prompt = async () => {
                    const response = await prompts({
                        type: "text",
                        name: "value",
                        message: `${chalk.blueBright("You: ")}`,
                        validate: () => {
                            return true
                        },
                        onState: (state) => {
                            if (state.aborted) {
                                process.exit(0);
                            }
                        }
                    })

                    switch (response.value) {
                        case "exit":
                            return process.exit(0);
                        case "clear":
                            return process.stdout.write("\x1Bc");
                        default:
                            if (apiKey != null) {
                                generateResponse(apiKey, prompt, response, opts);
                            }
                            return;
                    }
                };
                prompt();
            });
    });

// create commander to delete api key
commander
    .command("delete")
    .description("Delete your API key")
    .action(async () => {
        const response = await prompts({
            type: "select",
            name: "value",
            message: "Are you sure?",
            choices: [
                {title: "Yes", value: "yes"},
                {title: "No - exit", value: "no"},
            ],
            initial: 0,
        });

        if (response.value) {
            return process.exit(0)
        }

        deleteApiKey();
        console.log("API key deleted");
    });

commander
    .command("endpoint")
    .option("--set <url>", "Set your custom endpoint")
    .option("-r, --reset", "Reset the API endpoint to default ")
    .description("Configure your API endpoint")
    .action(async () => {
            console.log("Send empty to set default openai endpoint")
            prompts({
                type: "text",
                name: "value",
                validate: (t) =>
                    t.search(/(https?:\/(\/.)+).*/g) === 0 || t === "" ? true : "Urls only allowed",
                message: "Insert endpoint: "
            })
                .then(response =>
                    (response.value as string)
                        .replace('/chat/completions', '')
                )
                .then(value => /(https?:\/(\/.)+).*/g.test(value) ? value : undefined)
                .then(saveCustomUrl)
        }
    )

commander.parse(process.argv);
