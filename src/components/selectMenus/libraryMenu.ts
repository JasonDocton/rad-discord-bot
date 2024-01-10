import { AnxietyContent } from './../../library/anxiety'
import { StringSelectMenuBuilder } from 'discord.js'
import { SelectMenu } from '../../types'
import { DepressionContent } from '../../library/depression'
import { PanicContent } from '../../library/panic'

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
			const response = interaction.component.options.find((option) => option.value === values[0])
			if (response) {
				if (response.value === 'anxiety') await interaction.update(AnxietyContent)
				if (response.value === 'depression') await interaction.update(DepressionContent)
				if (response.value === 'panic') await interaction.update(PanicContent)
			}
		} catch (error) {
			console.error(error)
		}
	},
}

export default LibraryMenu
