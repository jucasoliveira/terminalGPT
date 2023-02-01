const { Configuration, OpenAIApi } = require("openai");
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

module.exports = {
  appendToFile,
  uploadFile,
};
