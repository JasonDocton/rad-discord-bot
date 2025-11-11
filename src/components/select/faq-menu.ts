import { StringSelectMenuBuilder } from 'discord.js'
import type { SelectMenu } from '@/types.ts'
import { logger } from '@/utils/logger.ts'

/**
 * FAQ Select Menu Component
 *
 * Interactive dropdown menu for the /faq command that displays answers
 * to frequently asked questions about RAD's therapy program.
 *
 * Options include:
 * - Geographic availability (U.S. and international)
 * - Application process
 * - Cost and insurance coverage
 * - Types of services covered
 * - Services that may not be covered (in-patient, court-mandated care)
 *
 * When a user selects an option, the message is updated with an embed
 * containing the answer.
 */
const FaqMenu: SelectMenu = {
	name: 'faq-menu',
	component: new StringSelectMenuBuilder()
		.setCustomId('faq-menu')
		.setPlaceholder('Select a topic')
		.setOptions([
			{
				emoji: '🌎',
				label: 'Is this only for the U.S?',
				description: 'Learn more about where this program is available.',
				value: 'Anyone, in any country may apply!',
			},
			{
				emoji: '📝',
				label: 'How do I apply?',
				description: 'Learn more about how to apply for therapy.',
				value: 'Use the slash command, **/therapy**, to begin. 💚',
			},
			{
				emoji: '💵',
				label: 'Is there a cost?',
				description: 'Learn more about the cost of therapy.',
				value:
					'For anyone without insurance or the ability to afford therapy, there is no cost.',
			},
			{
				emoji: '⚕️',
				label: 'What does RAD cover?',
				description: 'Learn more what types of services we cover.',
				value:
					'We cover psychotherapy and medication, as needed. Only empirically researched therapy is covered.',
			},
			{
				emoji: '🚫',
				label: 'What may not be covered?',
				description: 'Learn more about the types of services we may not cover.',
				value:
					"At present, we're unable to help with in-patient care, court mandated care, or court evaluations.",
			},
		]),

	execute: (interaction) => {
		try {
			const { values } = interaction
			const response = interaction.component.options.find(
				(option) => option.value === values[0]
			)
			if (response)
				interaction.update({
					embeds: [
						{
							title: `${response.emoji?.name}  ${response.label}`,
							description: response.value,
						},
					],
				})
		} catch (error) {
			logger.system(
				'select-menu:faq',
				'FAQ menu interaction failed',
				'error',
				error
			)
		}
	},
}

export { FaqMenu }
