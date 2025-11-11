<div align="center"><img src="https://res.cloudinary.com/df23ubjbb/image/upload/v1635199620/Github/RAD_Logo.png" width="32" /> </div>

<div align="center">
  <h1>RAD DISCORD BOT</h1>
  <h3>Our Core Discord Bot, Retooled & Modernized</h3>
  <a href="https://discord.js.org">
    <img width="32px" alt="discordjs" src="https://files.raycast.com/g4bdf2ysm8hh9k906wuf7iv92f7x">
  </a>
  <a href="https://www.convex.dev">
    <img width="32px" alt="convex" src="https://cdn.sanity.io/images/o0o2tn5x/production/285d09c87a0afb46b81044a49932f14539eb4778-400x400.png">
  </a>
  <a href="https://bun.com">
    <img width="32px" alt="bun" src="https://bun.sh/logo.svg"  />
  </a>
  <br />
  <br />
  <figure>
    <img src="https://i.ibb.co/kgp6JB1g/rad-bot.gif" alt="demo" />
  </figure>
</div>


## Features

- 🎩&nbsp; **Modern Tech Stack**
-- Ditch CommonJS and deprecated code. Only fresh Buns served with strong Typescript 5.9 usage, Zod Mini, the latest Convex features, and topped with Biome for all your linting/formatting needs.

- 🥷&nbsp; **Entirely Private Use**
-- Ephemeral commands keep everything private. Command use and all bot responses are only visible to the user, with an added option to DM the bot so not even a "user is typing..." appears in any channel the bot is in.

- 🎁&nbsp; **0 Cost Concern**
-- Deploy, host, and operate at no cost. Our lean usage of functions, protective rate-limiting, and tiny bundle means your bot would need to be in over 10,000 Discord Servers before upgrading to any paid Convex or Fly.io plan.

- 📊&nbsp; **Analytics & Monitoring**
-- Securely track bot usage and stability in Convex. Cleanly separated tables so you can quickly check key data points, and an optional webhook setup to push critical issues directly to you via Discord.

- 📄&nbsp; **Documented For Humans&AI**
-- Every file includes JSdocs & lots of comments. I've written as much text as I have code, then tasked an AI Agent to make sure everything makes sense to them.


## Intro
The goal of this project was to create a modernized Discord Bot that anyone could use as a template, example, or training source for AI Agents. When we first created the RAD's Discord Bot, it felt like the majority of examples and templates utilized old standards in coding, weren't using Typescript, and either were too robust to follow or too minimal to expand on. As RAD prepares to release a new version of our bot designed to scale to thousands of servers, I wanted to release this MVP that I hope is easy for others to follow and build from.

### 🎯 **Core Commands**
- **`/therapy`** - Connect users with Rise Above The Disorder's therapy program. This link will be updated when our public applications reopen.
- **`/faq`** - Interactive FAQ menu covering program availability, costs, coverage, and application process.
- **`/library`** - Mental health education library with detailed information on anxiety, depression, and panic attacks.
- **`/hotlines`** - Crisis hotline numbers for 41+ countries, split into easy-to-navigate A-M and N-Z menus.
- **`/about`** - Information about the bot and available commands.

## Setup

### 1. Install dependencies

```bash
bun install
```

### 2. Configure environment variables

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

Required environment variables:
- `DISCORD_BOT_TOKEN` - Your Discord bot token (keep secret!)
- `DISCORD_CLIENT_ID` - Your Discord application client ID
- `CONVEX_URL` - Your Convex deployment URL
- `THERAPY_INTAKE_URL` - The unique intake form URL for tracking

Optional environment variables:
- `DISCORD_MONITOR_CHANNEL_ID` - Channel ID for monitoring logs
- `DISCORD_MONITOR_WEBHOOK_URL` - Webhook URL for monitoring

### 3. Run the bot

```bash
bun dev
```

### Setting up Fly.io Secrets

Since sensitive values are not in `fly.toml`, you need to set them as Fly secrets:

```bash
# Set all required secrets for production
flyctl secrets set \
  CONVEX_URL=https://your-deployment.convex.cloud \
  DISCORD_BOT_TOKEN=your_discord_token \
  DISCORD_CLIENT_ID=your_client_id \
  THERAPY_INTAKE_URL=your_intake_form_url

# Optional: Discord monitoring (for production alerts)
flyctl secrets set \
  DISCORD_MONITOR_CHANNEL_ID=your_channel_id \
  DISCORD_MONITOR_WEBHOOK_URL=https://discord.com/api/webhooks/your_webhook
```

**Note**: `CONVEX_SITE_URL` is not required for Fly.io. It's only used when running Convex serverless functions.

## Support

- **Issues**: [GitHub Issues](https://github.com/JasonDocton/rad-discord-bot/issues)
- **Discord**: jasondocton

- **[Consider Sponsoring YouAreRAD](https://github.com/sponsors/youarerad)**: Just $30 helps our non-profit cover the cost of mental health care for someone in need.

<div align="center"><img src="https://res.cloudinary.com/df23ubjbb/image/upload/v1635199620/Github/RAD_Logo.png" width="32" /> </div>

[⬆ Back to Top](#rad-discord-bot)
