import { Glob } from 'bun'
import type { Client } from 'discord.js'
import type { SelectMenu } from '@/types.ts'
import { logger } from '@/utils/logger.ts'

/**
 * Loads and registers all UI components (select menus) with the Discord client
 *
 * Scans the components/select directory, imports each component file,
 * and registers them on the client for interaction handling.
 *
 * @param client - Discord.js client instance to register components on
 *
 * @example
 * ```ts
 * await handleComponents(client)
 * // All select menus are now registered
 * ```
 */
export async function handleComponents(client: Client) {
	const selectMenuDir = `${import.meta.dir}/../components/select`

	const glob = new Glob('*.ts')
	const files = Array.from(glob.scanSync(selectMenuDir))

	// Load each component individually with error handling
	for (const file of files) {
		try {
			const module = (await import(`${selectMenuDir}/${file}`)) as Record<
				string,
				SelectMenu | undefined
			>
			// Get all SelectMenu exports from the file (supports multiple exports per file)
			const components = Object.values(module).filter(
				(value): value is SelectMenu => value !== undefined && 'name' in value
			)

			for (const component of components) {
				client.selectMenus.set(component.name, component)

				logger.system(
					'component-handler',
					`Successfully loaded select menu: ${component.name}`,
					'success'
				)
			}
		} catch (error) {
			logger.system(
				'component-handler',
				`Failed to load select menu from ${file}`,
				'error',
				error
			)
		}
	}
}
