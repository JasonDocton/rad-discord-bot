import type { StringSelectMenuBuilder } from 'discord.js'
import { ActionRowBuilder, MessageFlags, SlashCommandBuilder } from 'discord.js'
import {
	HotlinesMenuAM,
	HotlinesMenuNZ,
} from '@/components/select/hotlines-menu.ts'
import type { SlashCommand } from '@/types.ts'
import { logger } from '@/utils/logger.ts'

/**
 * /hotlines slash command - Crisis hotlines by country
 *
 * Displays interactive dropdown menus with crisis and mental health
 * hotline numbers organized by country (40+ countries available).
 *
 * Due to Discord's 25-option limit per select menu, countries are split
 * into two menus: A-M and N-Z.
 *
 * Features:
 * - Suicide prevention hotlines
 * - Mental health crisis support
 * - Country-specific resources
 * - Emergency services reminder
 *
 * This command provides immediate access to crisis support resources
 * for users experiencing mental health emergencies.
 */
export const command: SlashCommand = {
	command: new SlashCommandBuilder()
		.setName('hotlines')
		.setDescription(
			'Access crisis hotlines and mental health support by country.'
		),
	execute: async (interaction) => {
		try {
			await interaction.reply({
				flags: MessageFlags.Ephemeral,
				components: [
					new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
						HotlinesMenuAM.component
					),
					new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
						HotlinesMenuNZ.component
					),
				],
				content:
					'**Crisis Hotlines** \n_Select your country from the dropdown lists below to view available mental health crisis hotlines._\n\n⚠️ **If you are in immediate danger, please contact your local emergency services immediately.**',
			})

			logger.command(interaction, 'hotlines', 'success')
		} catch (error) {
			logger.command(interaction, 'hotlines', 'error', error)
			// If reply failed, we can't edit it - just log the error
			console.error('Failed to send Hotlines command reply:', error)
		}
	},
}
