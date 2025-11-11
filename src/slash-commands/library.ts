import type { StringSelectMenuBuilder } from 'discord.js'
import { ActionRowBuilder, MessageFlags, SlashCommandBuilder } from 'discord.js'
import { LibraryMenu } from '@/components/select/library-menu.ts'
import type { SlashCommand } from '@/types.ts'
import { logger } from '@/utils/logger.ts'

/**
 * /library slash command - Mental health education library
 *
 * Displays an interactive dropdown menu providing educational content
 * about common mental health conditions and coping strategies.
 *
 * Topics available:
 * - Anxiety and anxiety disorders
 * - Clinical depression
 * - Panic attacks and management
 */
export const command: SlashCommand = {
	command: new SlashCommandBuilder()
		.setName('library')
		.setDescription(
			'Learn more about mental health by navigating our library.'
		),
	execute: async (interaction) => {
		try {
			await interaction.reply({
				flags: MessageFlags.Ephemeral,
				components: [
					new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
						LibraryMenu.component
					),
				],
				content:
					'**Mental Health Library** \n_Select a topic from the dropdown list to learn more._',
			})

			logger.command(interaction, 'library', 'success')
		} catch (error) {
			logger.command(interaction, 'library', 'error', error)
			// If reply failed, we can't edit it - just log the error
			console.error('Failed to send Library command reply:', error)
		}
	},
}
