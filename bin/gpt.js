const {Configuration, OpenAIApi} = require("openai");
const chalk = require("chalk");
const {loadWithRocketGradient} = require("./gradient");
const {getContext, addContext} = require("./context");

const generateCompletion = async (apiKey, prompt, opts, url) => {
    const configuration = new Configuration({
        apiKey,
        basePath: url
    });

    const openai = new OpenAIApi(configuration);
    const spinner = loadWithRocketGradient("Thinking...").start();

    addContext({
        "role": "system",
        "content": "Read the context, when returning the answer , always wrapping block of code exactly within triple backticks "
    });
    addContext({"role": "user", "content": prompt});

    const request = await openai.createChatCompletion({
        model: opts.engine || "gpt-3.5-turbo",
        messages: getContext(),
        temperature: opts.temperature ? Number(opts.temperature) : 1
    })
        .then((res) => {
            addContext(res.data.choices[0].message);
            spinner.stop();
            return res.data.choices[0].message;
        })
        .catch((err) => {
            spinner.stop();
            switch (err["response"]["status"]) {
                case 404:
                    throw new Error(
                        `${chalk.red(
                            "Not Found: Model not found. Please check the model name."
                        )}`
                    );
                case 429:
                    throw new Error(
                        `${chalk.red(
                            "API Rate Limit Exceeded: ChatGPT is getting too many requests from the user in a short period of time. Please wait a while before sending another message."
                        )}`
                    )
                case 400:
                    throw new Error(
                        `${chalk.red(
                            "Bad Request: Prompt provided is empty or too long. Prompt should be between 1 and 4096 tokens."
                        )}`
                    );
                case 402:
                    throw new Error(
                        `${chalk.red(
                            "Payment Required: ChatGPT quota exceeded. Please check you chatGPT account."
                        )}`
                    );
                case 503:
                    throw new Error(
                        `${chalk.red(
                            "Service Unavailable: ChatGPT is currently unavailable, possibly due to maintenance or high traffic. Please try again later."
                        )}`
                    );
                default:
                    throw new Error(`${err}`);
            }
        });

    if (request === undefined || !request?.content) {
        throw new Error("Undefined request or content");
    }

    return request;
};

module.exports = {
    generateCompletion,
};
