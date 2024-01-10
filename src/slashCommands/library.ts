import { ActionRowBuilder, SlashCommandBuilder, StringSelectMenuBuilder } from 'discord.js'
import { SlashCommand } from '../types'
import LibraryMenu from '../components/selectMenus/libraryMenu'

const command: SlashCommand = {
	command: new SlashCommandBuilder().setName('library').setDescription('Learn more about mental health by navigating our library.'),
	execute: (interaction) => {
		try {
			interaction.reply({
				ephemeral: true,
				components: [new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(LibraryMenu.component)],
				content: '**Mental Health Library** \n_Select a topic from the dropdown list to learn more._',
			})
		} catch (error) {
			interaction.editReply(`An error occurred while processing your request.${error}`)
		}
	},
}

export default command
