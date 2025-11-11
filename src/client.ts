import type { ClientOptions } from 'discord.js'
import { Client, GatewayIntentBits } from 'discord.js'

/**
 * Required Discord Gateway Intents
 *
 * This bot only uses slash commands and doesn't handle messages,
 * reactions, or typing events. Therefore, we only need the Guilds intent.
 *
 * - Guilds: Required for slash commands and bot presence
 */
const Intents: ClientOptions['intents'] = [GatewayIntentBits.Guilds]

/**
 * Discord client instance with minimal required intents
 */
export const client = new Client({
	intents: Intents,
})
