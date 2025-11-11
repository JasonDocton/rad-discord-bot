import type { Client } from 'discord.js'
import { ActivityType } from 'discord.js'
import type { BotEvent } from '@/types.ts'
import { sendBotStartup } from '@/utils/discord-monitor.ts'
import { logger, setDiscordClient } from '@/utils/logger.ts'

// Load Bot Info & Set Ready State
export const event: BotEvent = {
	name: 'clientReady',
	displayName: 'Ready State 🔔',
	once: true,
	execute: (...args) => {
		const client = args[0] as Client

		try {
			// Set Discord client for monitoring
			setDiscordClient(client)

			if (client.user) {
				client.user.setActivity('/therapy to learn more 💚', {
					type: ActivityType.Custom,
				})
			}

			logger.system('ready', 'Radbot is online and ready to help', 'info')

			// Send startup notification to monitoring channel
			sendBotStartup(client).catch((error) => {
				logger.system(
					'ready',
					'Failed to send startup notification',
					'warning',
					error
				)
			})
		} catch (error) {
			logger.system('ready', 'Bot failed to set activity', 'warning', error)
		}
	},
}
