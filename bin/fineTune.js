const { loadWithRocketGradient } = require("./gradient");
const { Configuration, OpenAIApi } = require("openai");

let fineTunneModel = "";

const setFineTuneModel = (model) => {
  fineTunneModel = model;
};

const getFineTuneModel = () => {
  return fineTunneModel;
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

module.exports = {
  fineTune,
  setFineTuneModel,
  getFineTuneModel,
};
