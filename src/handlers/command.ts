import { readdirSync } from 'fs'
import { join } from 'path'
import { Client, SlashCommandBuilder, REST, Routes } from 'discord.js'
import { SlashCommand } from '../types'
import { color } from '../utils/chalk'

module.exports = (client: Client) => {
	const slashCommands: SlashCommandBuilder[] = []
	const slashCommandsDir = join(__dirname, '../slashCommands')

	readdirSync(slashCommandsDir).forEach((file) => {
		if (!file.endsWith('.ts')) return
		const command: SlashCommand = require(`${slashCommandsDir}/${file}`).default
		slashCommands.push(command.command)
		client.slashCommands.set(command.command.name, command)
	})

	const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN!)

	rest
		.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID!), {
			body: slashCommands.map((command) => command.toJSON()),
		})

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		.then((data: any) => {
			console.log(color('success', `✅Successfully loaded ${color('variable', data.length)} slash command(s)`))
		})
		.catch((e) => {
			console.log(color('error', `❌ Failed to load slash commands: ${e}`))
		})
}
