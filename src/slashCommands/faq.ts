import { ActionRowBuilder, SlashCommandBuilder, StringSelectMenuBuilder } from 'discord.js'
import { SlashCommand } from '../types'
import FaqMenu from '../components/selectMenus/faqMenu'

const command: SlashCommand = {
	command: new SlashCommandBuilder().setName('faq').setDescription('Learn more about starting therapy with Rise Above The Disorder.'),
	execute: (interaction) => {
		try {
			interaction.reply({
				ephemeral: true,
				components: [new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(FaqMenu.component)],
				content: '**Starting Therapy FAQ** \n_Select a topic from the dropdown list to learn more._',
			})
		} catch (error) {
			interaction.editReply(`An error occurred while processing your request.${error}`)
		}
	},
}

export default command
