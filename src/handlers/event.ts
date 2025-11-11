import { Glob } from 'bun'
import type { Client } from 'discord.js'
import type { BotEvent } from '@/types.ts'
import { logger } from '@/utils/logger.ts'

/**
 * Loads and attaches all event handlers to the Discord client
 *
 * Scans the events directory, imports each event file, and registers
 * event listeners on the client (either once or on for recurring events).
 *
 * @param client - Discord.js client instance to attach events to
 *
 * @example
 * ```ts
 * await handleEvents(client)
 * // All events are now listening
 * ```
 */
export async function handleEvents(client: Client) {
	const eventsDir = `${import.meta.dir}/../events`
	const glob = new Glob('*.ts')
	const files = Array.from(glob.scanSync(eventsDir))

	// Load each event individually with error handling
	for (const file of files) {
		try {
			const module = (await import(`${eventsDir}/${file}`)) as {
				event: BotEvent
			}
			const { event } = module

			// Register event listener
			event.once
				? client.once(event.name, (...args) => event.execute(...args))
				: client.on(event.name, (...args) => event.execute(...args))

			logger.system(
				'event-handler',
				`Successfully loaded event: ${event.displayName || event.name}`,
				'success'
			)
		} catch (error) {
			logger.system(
				'event-handler',
				`Failed to load event from ${file}`,
				'error',
				error
			)
		}
	}
}
