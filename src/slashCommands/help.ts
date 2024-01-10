import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { SlashCommand } from '../types'
import { Hotlines } from '../library/hotlines'

const command: SlashCommand = {
	command: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Find mental health help lines in your country.')
		.addStringOption((option) => {
			return option.setName('country').setDescription('The country you want to search for.').setRequired(true).setAutocomplete(true)
		}),

	autocomplete: async (interaction) => {
		try {
			const focusedValue = interaction.options.getFocused()
			let filtered: { name: string; value: string }[] = []
			for (let i = 0; i < Hotlines.length; i++) {
				const choice = Hotlines[i]
				if (choice.name.includes(focusedValue)) filtered.push(choice)
			}
			await interaction.respond(filtered.splice(0, 25))
		} catch (error) {
			console.log(error)
		}
	},
	execute: async (interaction) => {
		try {
			await interaction.deferReply({ ephemeral: true })
			const options: { [key: string]: string | number | boolean } = {}
			for (let i = 0; i < interaction.options.data.length; i++) {
				const element = interaction.options.data[i]
				if (element.name && element.value) options[element.name] = element.value
			}
			const hotlineInfo = Hotlines.find((choice) => choice.value === options.country)?.data
			const countryName = Hotlines.find((choice) => choice.value === options.country)?.name

			const embed = new EmbedBuilder()
				.setColor('#60a5fa')
				.setTitle(`Mental Health Hotlines In ${countryName}`)
				.setDescription(`${hotlineInfo}`)

			return interaction.editReply({ embeds: [embed] })
		} catch (error) {
			console.log(error)
		}
	},
}

export default command
