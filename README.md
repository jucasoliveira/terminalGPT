# terminalGPT

Get GPT like chatGPT on your terminal

![Screenshot 2023-01-05 at 09 24 10](https://user-images.githubusercontent.com/11979969/210746185-69722c94-b073-4863-82bc-b662236c8305.png)

<a href="https://www.producthunt.com/posts/terminalgpt?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-terminalgpt" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=373888&theme=light" alt="terminalGPT - Use&#0032;OpenAi&#0032;like&#0032;chatGPT&#0044;&#0032;on&#0032;your&#0032;terminal | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>

# Pre-requisite

You'll need to have your own `OpenAi` apikey to operate this package.

1. Go to `https://beta.openai.com/`
2. Select you profile menu and go to `Manage API Keys`
3. Select `+ Create new secret key`
4. Copy generated key

# Get Started

```
 npx terminalgpt
```

# Run

```bash
npx terminalgpt chat
```

ps.: If it is your first time running it, it will ask for open AI key , `paste generated key from pre-requisite steps`

# Changing engine and temperature

```
npx terminalgpt chat --engine "text-davinci-002" --temperature 0.7
```
