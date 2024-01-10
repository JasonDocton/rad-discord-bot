import { Message } from 'discord.js'
import { BotEvent } from '../types'

const event: BotEvent = {
	name: 'messageCreate',
	displayName: 'Messages 💬',
	execute: async (message: Message) => {
		if (!message.member || message.member.user.bot) return
		if (!message.guild) return
	},
}

export default event
