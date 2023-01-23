## 😎 Contribute your first spec in < 3 minutes

Use the steps below:

<br/>

**Steps**

1. Click [here](https://github.com/jucasoliveira/terminalGPT/fork) to fork this repo.

2. Clone your forked repo and create an example spec

   ```bash
   # Replace `YOUR_GITHUB_USERNAME` with your own github username
   git clone https://github.com/YOUR_GITHUB_USERNAME/terminalGPT.git terminalGPT
   cd terminalGPT

   # Add jucasoliveira/terminalGPT as a remote
   git remote add upstream https://github.com/jucasoliveira/terminalGPT.git

   # Install packages
   npm install

   ```

3. On your terminal, type `npm run chat`. Your terminalGPT will start. 😊

<br>

## Extra / Remove from your computer

'npx terminalgpt' doesn't install the terminalgpt package, instead it downloads the package to your pc and directly executes it from the cache.

You can find the package using

`ls ~/.npm/_npx/*/node_modules`

To delete the package, you can use

`rm -r ~/.npm/_npx/*/node_modules/terminalgpt`
