/**
 * RAD Discord Bot - Main Entry Point
 *
 * Initializes and starts the Discord bot with the following flow:
 * 1. Validates environment variables (DISCORD_BOT_TOKEN required)
 * 2. Creates command and component collections on the client
 * 3. Loads slash commands, events, and select menu components
 * 4. Registers global crash handlers for process monitoring
 * 5. Logs in to Discord and starts listening for interactions
 *
 * The bot uses ephemeral commands (private responses) and minimal
 * Discord gateway intents (Guilds only) for privacy and performance.
 *
 * @see {@link handleCommands} - Loads slash commands from /slash-commands
 * @see {@link handleEvents} - Loads event handlers from /events
 * @see {@link handleComponents} - Loads select menus from /components/select
 */

import { Collection } from 'discord.js'
import { client } from '@/client.ts'
import { env } from '@/env.ts'
import { handleCommands } from '@/handlers/command.ts'
import { handleComponents } from '@/handlers/components.ts'
import { handleEvents } from '@/handlers/event.ts'
import type { SelectMenu, SlashCommand } from '@/types.ts'
import { color } from '@/utils/color.ts'
import { sendBotCrash } from '@/utils/discord-monitor.ts'
import { logger } from '@/utils/logger.ts'

// Validate bot token exists before proceeding
if (!env.DISCORD_BOT_TOKEN) {
	throw new Error(color('error', 'No bot token found!'))
}

// Initialize collections for slash commands and select menus
// These will be populated by the handlers and accessed via client.slashCommands/selectMenus
client.slashCommands = new Collection<string, SlashCommand>()
client.selectMenus = new Collection<string, SelectMenu>()

// Load all slash commands, events, and UI components
await handleCommands(client)
await handleEvents(client)
await handleComponents(client)

/**
 * Global crash handler for uncaught exceptions
 *
 * Ensures critical errors are logged and monitored before the process dies:
 * 1. Logs error to Convex system_logs table
 * 2. Sends crash alert to Discord monitoring channel (via webhook)
 * 3. Waits 1 second for webhook delivery
 * 4. Exits with error code
 */
process.on('uncaughtException', async (error: Error) => {
	logger.system('process', 'Uncaught exception - bot crashing', 'error', error)

	// Send crash alert via webhook (doesn't require bot client to be ready)
	try {
		await sendBotCrash(error, 'uncaughtException')
	} catch (alertError) {
		console.error(color('error', `Failed to send crash alert: ${alertError}`))
	}

	// Give webhook time to deliver before process terminates
	await new Promise((resolve) => setTimeout(resolve, 1000))
	process.exit(1)
})

/**
 * Global crash handler for unhandled promise rejections
 *
 * Catches async errors that weren't properly handled with try-catch.
 * Follows same monitoring flow as uncaughtException handler.
 */
process.on('unhandledRejection', async (reason: unknown) => {
	const error = reason instanceof Error ? reason : new Error(String(reason))
	logger.system('process', 'Unhandled promise rejection', 'error', error)

	// Send crash alert via webhook
	try {
		await sendBotCrash(error, 'unhandledRejection')
	} catch (alertError) {
		console.error(color('error', `Failed to send crash alert: ${alertError}`))
	}

	// Give webhook time to deliver before process terminates
	await new Promise((resolve) => setTimeout(resolve, 1000))
	process.exit(1)
})

// Connect to Discord and start listening for interactions
client.login(env.DISCORD_BOT_TOKEN)
