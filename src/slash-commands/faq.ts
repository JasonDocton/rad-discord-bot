import type { StringSelectMenuBuilder } from 'discord.js'
import { ActionRowBuilder, MessageFlags, SlashCommandBuilder } from 'discord.js'
import { FaqMenu } from '@/components/select/faq-menu.ts'
import type { SlashCommand } from '@/types.ts'
import { logger } from '@/utils/logger.ts'

/**
 * /faq slash command - Frequently Asked Questions about RAD's therapy program
 *
 * Displays an interactive dropdown menu with common questions about
 * starting therapy through Rise Above The Disorder.
 *
 * Topics covered:
 * - Geographic availability
 * - How to apply
 * - Cost and insurance
 * - Coverage details
 * - Services not covered
 */
export const command: SlashCommand = {
	command: new SlashCommandBuilder()
		.setName('faq')
		.setDescription(
			'Learn more about starting therapy with Rise Above The Disorder.'
		),
	execute: async (interaction) => {
		try {
			await interaction.reply({
				flags: MessageFlags.Ephemeral,
				components: [
					new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
						FaqMenu.component
					),
				],
				content:
					'**Starting Therapy FAQ** \n_Select a topic from the dropdown list to learn more._',
			})

			logger.command(interaction, 'faq', 'success')
		} catch (error) {
			logger.command(interaction, 'faq', 'error', error)
			// If reply failed, we can't edit it - just log the error
			console.error('Failed to send FAQ command reply:', error)
		}
	},
}
