#!/usr/bin/env node

const commander = require("commander");
const prompts = require("prompts");
const chalk = require("chalk");
const process = require("process");

const {intro} = require("./intro");
const {apiKeyPrompt, generateResponse} = require("./utils");
const {deleteApiKey} = require("./encrypt");
const {getCustomUrl, saveCustomUrl} = require("./encrypt")

commander
    .command("chat")
    .option("-e, --engine <engine>", "GPT model to use")
    .option("-t, --temperature <temperature>", "Response temperature")
    .option("-m, --markdown", "Show markdown in the terminal")
    .usage(`"<project-directory>" [options]`)
    .action(async (opts) => {
        intro();
        apiKeyPrompt().then((apiKey) => {
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
                });

                switch (response.value) {
                    case "exit":
                        return process.exit(0);
                    case "clear":
                        return process.stdout.write("\x1Bc");
                    default:
                        generateResponse(apiKey, prompt, response, opts, getCustomUrl());
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

        switch (response.value) {
            case "no":
                return process.exit(0);
            case "yes":
            default:
                // call the function again
                deleteApiKey();
                break;
        }
        deleteApiKey();
        console.log("API key deleted");
    });

// commander
//     .command("endpoint")
//     .option("--set <url>", "Set your custom endpoint")
//     .option("-r, --reset", "Reset the API endpoint to default ")
//     .description("Configure your API endpoint")
//     .action(async () => {
//             console.log("Send empty to set default openai endpoint")
//             prompts({
//                 type: "text",
//                 name: "value",
//                 validate: (t) =>
//                     t.search(/(https?:\/(\/.)+).*/g) === 0 || t === "" ? true : "Urls only allowed",
//                 message: "Insert endpoint: "
//             }).then(response => saveCustomUrl(/(https?:\/(\/.)+).*/g.test(response.value) ? response.value : undefined))
//
//
//         }
//     )

commander.parse(process.argv);
