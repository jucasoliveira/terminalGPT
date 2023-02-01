//const fs = require("fs");

//const contextFile = `${__dirname}/../data/context-terminal-gpt.txt`;
let context = "";

const addContext = (text) => {
  context = `${context}\n ${text}`;
  /*
  if (!fs.existsSync(contextFile)) {
    fs.createWriteStream(contextFile).on("open", function (fd) {
      fs.appendFileSync(fd, text + "\n");
    });
  } else {
    fs.appendFileSync(contextFile, text + "\n");
  }
  */
};

const getContext = () => {
  return context;
};

module.exports = {
  addContext,
  getContext,
};
