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
Get GPT-like chatGPT on your terminal
</p>

![Screenshot 2023-01-05 at 09 24 10](https://user-images.githubusercontent.com/11979969/210746185-69722c94-b073-4863-82bc-b662236c8305.png)

<p align="center">
<a href="https://www.producthunt.com/posts/terminalgpt?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-terminalgpt" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=373888&theme=light" alt="terminalGPT - Use&#0032;OpenAi&#0032;like&#0032;chatGPT&#0044;&#0032;on&#0032;your&#0032;terminal | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>

</p>

## Prerequisites

You'll need to have your own `OpenAi` apikey to operate this package.

1. Go to <https://platform.openai.com>
2. Select your profile menu and go to `View API Keys`
3. Select `+ Create new secret key`
4. Copy generated key

# Installation

Install terminalGPT globally:

```bash
npm -g install terminalgpt
```

or

```bash
yarn global add terminalgpt
```

## Start chat

```bash
tgpt chat
```

PS: If it is your first time running it, it will ask for open AI key, **paste generated key from pre-requisite steps**.

## Options

### Change engine and temperature

```bash
tgpt chat --engine "gpt-4" --temperature 0.7
```

Note this library uses [Chat Completions API](https://platform.openai.com/docs/api-reference/chat).
The `engine` parameter is the same as the `model` parameter in the API. The default value is `gpt-3.5-turbo`.

### Use markdown

```bash
tgpt chat --markdown
```

## Change or delete api key

It you are not satisfied or added a wrong api key, run

```bash
tgpt delete
```

## Using with npx

```bash
npx terminalgpt
```

```bash
npx terminalgpt <command>
```

Note `npx terminalgpt` doesn't install the terminalgpt package, instead it downloads the package to your computer and directly executes it from the cache.

You can find the package using

`ls ~/.npm/_npx/*/node_modules`

To delete the package, you can use

`rm -r ~/.npm/_npx/*/node_modules/terminalgpt`

## Contributing

Refer to CONTRIBUTING.md 😎

## ✨ Contributors

<a href="https://github.com/jucasoliveira/terminalGPT/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=jucasoliveira/terminalGPT" />
</a>
