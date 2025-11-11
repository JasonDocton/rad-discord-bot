import type { Interaction } from 'discord.js'
import type { BotEvent } from '@/types.ts'
import { logger } from '@/utils/logger.ts'

/**
 * Interaction Create Event Handler
 *
 * Central router for all Discord interactions (slash commands, autocomplete, select menus).
 * Routes each interaction type to its registered handler and logs execution failures.
 *
 * Interaction types handled:
 * - Chat input commands (slash commands like /therapy, /faq)
 * - Autocomplete interactions (for slash command options)
 * - String select menus (dropdown menus in FAQ, library, hotlines)
 *
 * Error handling:
 * - Missing handlers are logged as warnings
 * - Execution errors are caught and logged without crashing the bot
 *
 * @see {@link BotEvent} - Event interface this implements
 */
export const event: BotEvent = {
	name: 'interactionCreate',
	execute: (...args) => {
		const interaction = args[0] as Interaction

		// Handle slash command interactions
		if (interaction.isChatInputCommand()) {
			const command = interaction.client.slashCommands.get(
				interaction.commandName
			)
			if (!command) {
				logger.system(
					'interaction-create',
					`Command ${interaction.commandName} not found`,
					'warning'
				)
				return
			}

			try {
				command.execute(interaction)
			} catch (error) {
				logger.system(
					'interaction-create',
					`Command ${interaction.commandName} execution failed`,
					'error',
					error
				)
			}
		}
		// Handle autocomplete interactions (for slash command options)
		else if (interaction.isAutocomplete()) {
			const command = interaction.client.slashCommands.get(
				interaction.commandName
			)
			if (!command) {
				logger.system(
					'interaction-create',
					`Command ${interaction.commandName} not found for autocomplete`,
					'warning'
				)
				return
			}

			try {
				if (!command.autocomplete) return
				command.autocomplete(interaction)
			} catch (error) {
				logger.system(
					'interaction-create',
					`Autocomplete for ${interaction.commandName} failed`,
					'error',
					error
				)
			}
		}
		// Handle select menu interactions (dropdowns in FAQ, library, hotlines)
		else if (interaction.isStringSelectMenu()) {
			const { customId } = interaction
			const selectMenu = interaction.client.selectMenus.get(customId)
			if (!selectMenu) {
				logger.system(
					'interaction-create',
					`Select Menu ${customId} not found`,
					'warning'
				)
				return
			}

			try {
				selectMenu.execute(interaction)
			} catch (error) {
				logger.system(
					'interaction-create',
					`Select Menu ${customId} execution failed`,
					'error',
					error
				)
			}
		}
	},
	displayName: 'Interactions 🫧',
	once: false,
}
