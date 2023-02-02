<p align="center">
  <img width="200" alt="TerminalGPT logo" src="https://user-images.githubusercontent.com/11979969/211214696-7519a871-4981-44a8-8c2d-a1d187839126.png"/>
</p>

<p align="center">
   <img width="80" alt="TerminalGPT logo" src="https://img.shields.io/github/actions/workflow/status/jucasoliveira/terminalGPT/pr.yml"/>
   <img width="100" alt="TerminalGPT logo" src="https://img.shields.io/npm/dt/terminalgpt"/>
   <img width="100" alt="TerminalGPT logo" src="https://img.shields.io/github/contributors/jucasoliveira/terminalGPT"/>
   <img width="100" alt="TerminalGPT logo" src="https://img.shields.io/github/package-json/v/jucasoliveira/terminalGPT"/>
   
</p>

<p align="center">
Get GPT like chatGPT on your terminal
</p>

![Screenshot 2023-01-05 at 09 24 10](https://user-images.githubusercontent.com/11979969/210746185-69722c94-b073-4863-82bc-b662236c8305.png)

<p align="center">
<a href="https://www.producthunt.com/posts/terminalgpt?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-terminalgpt" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=373888&theme=light" alt="terminalGPT - Use&#0032;OpenAi&#0032;like&#0032;chatGPT&#0044;&#0032;on&#0032;your&#0032;terminal | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>

</p>

# Pre-requisite

You'll need to have your own `OpenAi` apikey to operate this package.

1. Go to `https://beta.openai.com/`
2. Select you profile menu and go to `Manage API Keys`
3. Select `+ Create new secret key`
4. Copy generated key

# Get Started

# Using tgpt

```
npm -g install terminalgpt
```

or

```
yarn global add terminalgpt
```

### Run

```bash
tgpt chat
```

ps.: If it is your first time running it, it will ask for open AI key , `paste generated key from pre-requisite steps`

### Changing engine and temperature

```
tgpt chat --engine "text-davinci-002" --temperature 0.7
```

### Changing api key

It you are not satisfy or added a wrong api key , run

```
tgpt delete
```

# Using with npx

```

npx terminalgpt

```

### Run

```bash
npx terminalgpt chat
```

ps.: If it is your first time running it, it will ask for open AI key , `paste generated key from pre-requisite steps`

### Changing engine and temperature

```
npx terminalgpt chat --engine "text-davinci-002" --temperature 0.7
```

### Changing api key

If you are not satisfied or entered a wrong api key, run

```
npx terminalgpt delete
```

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

## ✨ Contributors

<a href="https://github.com/jucasoliveira/terminalGPT/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=jucasoliveira/terminalGPT" />
</a>
