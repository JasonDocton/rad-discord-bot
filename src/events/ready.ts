import { ActivityType, Client } from 'discord.js'
import { BotEvent } from '../types'
import { color } from '../utils/chalk'

// Load Bot Info
const event: BotEvent = {
	name: 'ready',
	displayName: 'Ready State 🔔',
	once: true,
	execute: (client: Client) => {
		try {
			client.user?.setActivity('/therapy to learn more 💚', { type: ActivityType.Custom })
		} catch (error) {
			console.error(color('error', error))
		}
		console.log(color('text', '🌈 Radbot is online and ready to help 🌈'))
	},
}

export default event
