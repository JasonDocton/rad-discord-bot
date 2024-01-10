import { Interaction } from 'discord.js'
import { BotEvent } from '../types'
import { color } from '../utils/chalk'

const event: BotEvent = {
	name: 'interactionCreate',
	displayName: 'Interactions 🫧',
	execute: (interaction: Interaction) => {
		if (interaction.isChatInputCommand()) {
			const command = interaction.client.slashCommands.get(interaction.commandName)
			if (!command) return
			command.execute(interaction)
		} else if (interaction.isAutocomplete()) {
			const command = interaction.client.slashCommands.get(interaction.commandName)
			if (!command) {
				console.log(color('error', `Command ${interaction.commandName} not found`))
				return
			}
			try {
				if (!command.autocomplete) return
				command.autocomplete(interaction)
			} catch (error) {
				console.error(color('error', error))
			}
		} else if (interaction.isStringSelectMenu()) {
			const { customId } = interaction
			const command = interaction.client.selectMenus.get(customId)
			if (!command) {
				console.error(color('error', `Select Menu ${customId} not found`))
				return
			}
			try {
				command.execute(interaction)
			} catch (error) {
				console.error(color('error', error))
			}
		}
	},
}

export default event
