const { Configuration, OpenAIApi } = require("openai");
const chalk = require("chalk");
const { loadWithRocketGradient } = require("./gradient");
const { getContext, addContext } = require("./context");


const generateCompletion = async (apiKey, prompt, opts) => {
  try {
    
    const configuration = new Configuration({
      apiKey,
    });

    const openai = new OpenAIApi(configuration);
    const spinner = loadWithRocketGradient("Thinking...").start();
    
    addContext({"role": "system", "content": "Read the context, when returning the answer , always wrapping block of code exactly within triple backticks "});
    addContext({"role": "user", "content": prompt});

    const request = await openai.createChatCompletion({
      model: opts.engine || "gpt-3.5-turbo",
      messages: getContext(),
      temperature: opts.temperature ? Number(opts.temperature) : 1,
    })
      .then((res) => {
        addContext(res.data.choices[0].message);
        spinner.stop();
        return res.data.choices[0].message;
      })
      .catch((err) => {
        if (err["response"]["status"] == "404") {
          console.error(
            `${chalk.red(
              "\nNot Found: Model not found. Please check the model name."
            )}`
          );
        }
        if (err["response"]["status"] == "429") {
          console.error(
            `${chalk.red(
              "\nAPI Rate Limit Exceeded: ChatGPT is getting too many requests from the user in a short period of time. Please wait a while before sending another message."
            )}`
          );
        }
        if (err["response"]["status"] == "400") {
          console.error(
            `${chalk.red(
              "\nBad Request: Prompt provided is empty or too long. Prompt should be between 1 and 4096 tokens."
            )}`
          );
        }
        if (err["response"]["status"] == "402") {
          console.error(
            `${chalk.red(
              "\nPayment Required: ChatGPT quota exceeded. Please check you chatGPT account."
            )}`
          );
        }
        if (err["response"]["status"] == "503") {
          console.error(
            `${chalk.red(
              "\nService Unavailable: ChatGPT is currently unavailable, possibly due to maintenance or high traffic. Please try again later."
            )}`
          );
        } else {
          console.error(`${chalk.red("Something went wrong!!!")} ${err}`);
        }

        spinner.stop();
        return "error";
      });

    if (request == undefined || !request?.content) {
      throw new Error("Something went wrong!");
    }

    return request;
  } catch (error) {
    console.error(`${chalk.red("Something went wrong!!")} ${error}`);
  }
};

module.exports = {
  generateCompletion,
};
