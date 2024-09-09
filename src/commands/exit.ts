import chalk from "chalk";

const exitFunc = () => {
  console.log(chalk.yellow("Goodbye!"));
  process.exit(0);
};

export default exitFunc;
