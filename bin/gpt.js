const { Configuration, OpenAIApi } = require("openai");
const chalk = require("chalk");
const fs = require("fs");
const { loadWithRocketGradient } = require("./gradient");

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

const uploadFile = async (apiKey, file) => {
  const configuration = new Configuration({
    apiKey,
  });

  const openai = new OpenAIApi(configuration);
  const spinner = loadWithRocketGradient("Upload file...").start();
  const response = await openai
    .createFile(fs.createReadStream(file), "fine-tune")
    .then((res) => {
      spinner.stop();
      return res;
    });
  return response.data;
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
    })
    .then((res) => {
      spinner.stop();
      return res;
    });
  return response.data;
};

let context = "";

const addContext = (text) => {
  context = `${context}\n${text}`;
};

const getContext = () => {
  return context;
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
    const request = await openai
      .createCompletion({
        model: options.engine || "text-davinci-002",
        prompt: `${innerContext}\n${prompt}`,
        max_tokens: 2048,
        temperature: parseInt(options.temperature) || 0.5,
      })
      .then((res) => {
        spinner.stop();
        return res;
      })
      .catch((err) => {
        if (err["response"]["status"] == "429") {
          console.error(
            `${chalk.red(
              "\nChat GPT is having too many requests, wait and send it again."
            )}`
          );
        } else {
          console.error(`${chalk.red("Something went wrong!!")} ${err}`);
        }

        spinner.stop();
        return "error";
      });

    if (request == undefined || !request.data?.choices?.[0].text) {
      throw new Error("Something went wrong!");
    }

    appendToFile(file, prompt, request.data.choices[0].text);
    const uploadedFile = await uploadFile(apiKey, file);
    const fineTuning = await fineTune(apiKey, uploadedFile.id);
    console.log(fineTuning);

    addContext(request.data.choices[0].text);
    return request;
  } catch (error) {
    console.error(`${chalk.red("Something went wrong!!")} ${error}`);
  }
};

module.exports = {
  appendToFile,
  generateCompletion,
};
