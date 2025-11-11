import { StringSelectMenuBuilder } from 'discord.js'
import { AnxietyContent } from '@/content/anxiety.ts'
import { DepressionContent } from '@/content/depression.ts'
import { PanicContent } from '@/content/panic.ts'
import type { SelectMenu } from '@/types.ts'
import { logger } from '@/utils/logger.ts'

/**
 * Library Select Menu Component
 *
 * Interactive dropdown menu for the /library command that provides
 * educational content about common mental health conditions.
 *
 * Topics available:
 * - Anxiety: Symptoms, diagnosis, and treatment options
 * - Depression: Clinical depression information and treatment
 * - Panic Attacks: Understanding and managing panic episodes
 *
 * When a user selects a topic, the message is updated with comprehensive
 * embedded content including symptoms, diagnosis, and treatment information.
 */
const LibraryMenu: SelectMenu = {
	name: 'library-menu',
	component: new StringSelectMenuBuilder()
		.setCustomId('library-menu')
		.setPlaceholder('Select a topic')
		.setOptions([
			{
				emoji: '😰',
				label: 'What is Anxiety?',
				description: 'Learn more about Anxiety & Anxiety Disorders.',
				value: 'anxiety',
			},
			{
				emoji: '😕',
				label: 'What is Depression?',
				description: 'Learn more about Clinical Depression.',
				value: 'depression',
			},
			{
				emoji: '⚠️',
				label: 'What is a Panic Attack?',
				description: 'Learn more about Panic Attacks.',
				value: 'panic',
			},
		]),

	execute: async (interaction) => {
		try {
			const { values } = interaction
			const response = interaction.component.options.find(
				(option) => option.value === values[0]
			)
			if (response) {
				if (response.value === 'anxiety')
					await interaction.update(AnxietyContent)
				if (response.value === 'depression')
					await interaction.update(DepressionContent)
				if (response.value === 'panic') await interaction.update(PanicContent)
			}
		} catch (error) {
			logger.system(
				'select-menu:library',
				'Library menu interaction failed',
				'error',
				error
			)
		}
	},
}

export { LibraryMenu }
