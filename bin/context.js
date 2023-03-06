//const fs = require("fs");

//const contextFile = `${__dirname}/../data/context-terminal-gpt.txt`;
let context = [];

const addContext = (text) => {
  context = [...context, text];
};

const getContext = () => {
  return context;
};

module.exports = {
  addContext,
  getContext,
};
