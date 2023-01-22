const { Configuration, OpenAIApi } = require("openai");
const chalk = require("chalk");
const fs = require("fs");
const { loadWithRocketGradient } = require("./gradient");

// variables
let context = "";
let converstationLimit = 0;

let fineTunneModel = "";

//getters and setters

const addContext = (text) => {
  context = `${context}\n ${text}`;
};

const getContext = () => {
  return context;
};

const setFineTuneModel = (model) => {
  fineTunneModel = model;
};

const getFineTuneModel = () => {
  return fineTunneModel;
};

const checkModel = (options) => {
  return getFineTuneModel() || options.engine || "text-davinci-002";
};

// API calls

const appendToFile = (file, message, response) => {
  // find file, if not , create it
  // append to file with the structure {"prompt": messge, "completion": response}

  if (!fs.existsSync(file)) {
    fs.createWriteStream(file).on("open", function (fd) {
      fs.appendFileSync(
        fd,
        JSON.stringify({ prompt: message, completion: response }) + "\n"
      );
    });
  } else {
    fs.appendFileSync(
      file,
      JSON.stringify({ prompt: message, completion: response }) + "\n"
    );
  }
  return;
};

const retrieveFile = async (apiKey, fileID) => {
  const { Configuration, OpenAIApi } = require("openai");
  const configuration = new Configuration({
    apiKey: apiKey,
  });
  const openai = new OpenAIApi(configuration);
  const response = await openai.retrieveFile(fileID);
  // while the file status is not "processed" , wait 5 seconds and try again
  while (response.data.status !== "processed") {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    const newRetrieve = await openai.retrieveFile(fileID);
    if (newRetrieve.data.status === "processed") {
      return;
    }
  }
};

const uploadFile = async (apiKey, file) => {
  try {
    const configuration = new Configuration({
      apiKey,
    });

    const openai = new OpenAIApi(configuration);
    const spinner = loadWithRocketGradient("Upload file...").start();
    const response = await openai
      .createFile(fs.createReadStream(file), "fine-tune")
      .then((res) => {
        return res;
      });

    await retrieveFile(apiKey, response.data.id);
    spinner.stop();
    return response.data;
  } catch (err) {
    console.error(err);
  }
};

const retrieveFineTune = async (apiKey, tunneID) => {
  const { Configuration, OpenAIApi } = require("openai");
  const configuration = new Configuration({
    apiKey: apiKey,
  });
  const openai = new OpenAIApi(configuration);
  const response = await openai.retrieveFineTune(tunneID);
  while (response.data.status !== "succeeded") {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    const newRetrieve = await openai.retrieveFineTune(tunneID);
    if (newRetrieve.data.status === "succeeded") {
      return;
    }
  }
};

const fineTune = async (apiKey, fileID) => {
  const configuration = new Configuration({
    apiKey,
  });

  const openai = new OpenAIApi(configuration);
  const spinner = loadWithRocketGradient("Fine tuning...").start();
  const response = await openai
    .createFineTune({
      training_file: fileID,
      model: "text-davinci-003",
    })
    .then((res) => {
      return res;
    });

  await retrieveFineTune(apiKey, response.data.id);
  spinner.stop();
  return response.data;
};

const generateCompletion = async (apiKey, model, prompt, options) => {
  try {
    let innerContext = getContext();
    const tgptModel = `${model}-terminal-gpt`;
    const file = `${__dirname}/../data/${tgptModel}.jsonl`;
    const configuration = new Configuration({
      apiKey,
    });

    const openai = new OpenAIApi(configuration);
    const spinner = loadWithRocketGradient("Thinking...").start();
    addContext(`User: ${prompt}\n`);

    const request = await openai
      .createCompletion({
        model: checkModel(options),
        prompt: `${innerContext}\n${prompt}\n when writing code , return in code block markdown`,
        max_tokens: 2048,
        temperature: parseInt(options.temperature) || 0.5,
      })
      .then((res) => {
        addContext(`GPT-3: ${res.data.choices[0].text}`);
        spinner.stop();
        return res;
      })
      .catch((err) => {
        checkModel(options);
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

    if (request == undefined || !request.data?.choices?.[0].text) {
      throw new Error("Something went wrong!");
    }

    if (options.finetunning) {
      converstationLimit = converstationLimit + 1;
      appendToFile(file, prompt, request.data.choices[0].text);
      if (converstationLimit === parseInt(options.limit)) {
        const uploadedFile = await uploadFile(apiKey, file);
        const fineTuning = await fineTune(apiKey, uploadedFile.id);
        setFineTuneModel(fineTuning.fine_tuned_model);
        addContext("");
      }
    }
    return request;
  } catch (error) {
    console.error(`${chalk.red("Something went wrong!!")} ${error}`);
  }
};

module.exports = {
  appendToFile,
  generateCompletion,
};
