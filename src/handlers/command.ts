import { Glob } from 'bun'
import type { Client, SlashCommandBuilder } from 'discord.js'
import { REST, Routes } from 'discord.js'
import { env } from '@/env.ts'
import type { SlashCommand } from '@/types.ts'
import { logger } from '@/utils/logger.ts'

const discordApiVersion = '10' as const

/**
 * Loads and registers all slash commands with Discord
 *
 * Scans the slash-commands directory, imports each command file,
 * registers them with the Discord client, and syncs them to Discord's API.
 *
 * @param client - Discord.js client instance to register commands on
 *
 * @example
 * ```ts
 * await handleCommands(client)
 * // Commands are now loaded and registered with Discord
 * ```
 */
export async function handleCommands(client: Client) {
	const slashCommands: SlashCommandBuilder[] = []
	const slashCommandsDir = `${import.meta.dir}/../slash-commands`

	const glob = new Glob('*.ts')
	const files = Array.from(glob.scanSync(slashCommandsDir))

	// Load each command individually with error handling
	for (const file of files) {
		try {
			const module = (await import(`${slashCommandsDir}/${file}`)) as {
				command: SlashCommand
			}
			slashCommands.push(module.command.command)
			client.slashCommands.set(module.command.command.name, module.command)

			logger.system(
				'command-handler',
				`Successfully loaded slash command: ${module.command.command.name}`,
				'success'
			)
		} catch (error) {
			logger.system(
				'command-handler',
				`Failed to load slash command from ${file}`,
				'error',
				error
			)
		}
	}

	// Register commands with Discord
	const rest = new REST({ version: discordApiVersion }).setToken(
		env.DISCORD_BOT_TOKEN
	)

	try {
		await rest.put(Routes.applicationCommands(env.DISCORD_CLIENT_ID), {
			body: slashCommands.map((command) => command.toJSON()),
		})

		logger.system(
			'command-handler',
			`Successfully registered ${slashCommands.length} slash commands with Discord`,
			'success'
		)
	} catch (error) {
		logger.system(
			'command-handler',
			'Failed to register slash commands with Discord',
			'error',
			error
		)
	}
}
