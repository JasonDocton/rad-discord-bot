import { config } from 'dotenv'
import { color } from './utils/chalk'
import { client } from './client'
import { Collection } from 'discord.js'
import { SelectMenu, SlashCommand } from './types'
import { join } from 'path'
import { readdirSync } from 'fs'

// Load environment variables from .env file or log error if no .env file found
config()
if (!process.env.DISCORD_BOT_TOKEN) {
	throw new Error(color('error', 'No bot token found!'))
}

// Create collections for commands we will be loading into the client
client.slashCommands = new Collection<string, SlashCommand>()
client.selectMenus = new Collection<string, SelectMenu>()

// Load handlers from the handler directory
const handlersDir = join(__dirname, './handlers')
readdirSync(handlersDir).forEach((handler) => {
	require(`${handlersDir}/${handler}`)(client)
})

// Console log whenever a Promise is rejected
process.on('unhandledRejection', (error: ErrorEvent) => {
	console.error(color('error', error.message))
})

// Wake up 🤖
client.login(process.env.DISCORD_BOT_TOKEN)
