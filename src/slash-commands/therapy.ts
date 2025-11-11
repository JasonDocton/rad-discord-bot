import {
	ButtonStyle,
	ComponentType,
	EmbedBuilder,
	MessageFlags,
	SlashCommandBuilder,
} from 'discord.js'
import { env } from '@/env.ts'
import type { SlashCommand } from '@/types.ts'
import { logger } from '@/utils/logger.ts'

/**
 * /therapy slash command - Core metric for RAD Discord Bot
 *
 * Provides information about starting therapy with Rise Above The Disorder
 * and includes a link to the therapy intake form. This is the primary
 * success metric for the application.
 *
 * Features:
 * - Ephemeral message (only visible to command user)
 * - Embedded instructions with professional formatting
 * - Button link to intake form (uses unique tracking URL)
 * - Comprehensive logging to therapy_sessions and command_logs tables
 */
export const command: SlashCommand = {
	command: new SlashCommandBuilder()
		.setName('therapy')
		.setDescription('Start seeing a therapist with Rise Above The Disorder.'),

	execute: (interaction) => {
		try {
			interaction.reply({
				flags: MessageFlags.Ephemeral,
				content:
					"Hey there! I'd be happy to help you start therapy! I'll link the steps below 😊. Once you've completed the intake form, one of our mental health professionals will reach out to schedule a call with you. This call can be done with or without video.",
				embeds: [
					new EmbedBuilder()
						.setTitle('How To Start Therapy With RAD')
						.setColor('#60a5fa')
						.setDescription(
							'```ansi\n1. Fill out our intake form.\n2. Talk with one of our social workers.\n3. Start seeing a therapist local to you 💚.```'
						)
						.setFooter({
							text: "❧Please note, it may take our team a few days to contact you, as we're expecting a lot of requests with the launch of this program.",
						}),
				],
				components: [
					{
						type: ComponentType.ActionRow,
						components: [
							{
								style: ButtonStyle.Link,
								label: `📝 Intake Form`,
								url: env.THERAPY_INTAKE_URL,
								disabled: false,
								type: ComponentType.Button,
							},
						],
					},
				],
			})

			// Log successful therapy session (CORE METRIC)
			logger.therapy(interaction, 'success')
		} catch (error) {
			// Log failed therapy session
			logger.therapy(interaction, 'error', error)

			// Re-throw to let Discord.js handle it
			throw error
		}
	},
}
