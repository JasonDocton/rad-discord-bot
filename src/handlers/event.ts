import { readdirSync } from 'fs'
import { join } from 'path'
import { color } from '../utils/chalk'
import { BotEvent } from '../types'
import { Client } from 'discord.js'

module.exports = (client: Client) => {
	const eventsDir = join(__dirname, '../events')

	readdirSync(eventsDir).forEach((file) => {
		if (!file.endsWith('.ts')) return
		const event: BotEvent = require(`${eventsDir}/${file}`).default
		event.once ? client.once(event.name, (...args) => event.execute(...args)) : client.on(event.name, (...args) => event.execute(...args))
		console.log(color('success', `✅Successfully loaded event: ${color('variable', event.displayName || event.name)}`))
	})
}
