import discord, { ClientOptions, GatewayIntentBits } from 'discord.js'

// Intents define which events Discord should send to our bot. Here we list several intents that we want to use, based on what data our bot needs to function. For example, we want to listen to direct messages; thus, we need the DirectMessages intent. You can read more about intents here: https://discordjs.guide/popular-topics/intents.html#gateway-intents
const Intents: ClientOptions['intents'] = [
	GatewayIntentBits.DirectMessageReactions,
	GatewayIntentBits.DirectMessageTyping,
	GatewayIntentBits.DirectMessages,
	GatewayIntentBits.GuildEmojisAndStickers,
	GatewayIntentBits.GuildIntegrations,
	GatewayIntentBits.GuildMembers,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.GuildMessageReactions,
	GatewayIntentBits.GuildMessageTyping,
	GatewayIntentBits.Guilds,
	GatewayIntentBits.MessageContent,
]

// Create a new client instance that includes our intents.
export const client = new discord.Client({
	intents: Intents,
})
