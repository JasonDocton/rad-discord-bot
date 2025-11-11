import { api } from 'convex/_generated/api'
import { ConvexHttpClient } from 'convex/browser'
import type { CommandName, Severity, Status } from 'convex/schema'
import type {
	Client,
	CommandInteraction,
	StringSelectMenuInteraction,
} from 'discord.js'
import { env } from '@/env.ts'
import { color } from './color.ts'
import { sendCommandError, sendTherapyError } from './discord-monitor.ts'

/**
 * Simplified logger for RAD Discord Bot
 *
 * Features:
 * - Auto-extracts user/guild data from Discord interactions
 * - Console logging in development
 * - Database logging via Convex (async, non-blocking)
 * - Minimal API surface
 *
 * Usage:
 * ```ts
 * // Log therapy session (auto-extracts user/guild from interaction)
 * logger.therapy(interaction, 'success')
 * logger.therapy(interaction, 'error', error)
 *
 * // Log any command (auto-extracts user/guild from interaction)
 * logger.command(interaction, 'about', 'success')
 * logger.command(interaction, 'faq', 'error', error)
 *
 * // Log system events (location-based)
 * logger.system('ready', 'Radbot is online and ready to help', 'info')
 * logger.system('command-handler', 'Successfully loaded slash command: therapy', 'success')
 * logger.system('command-handler', 'Failed to load slash command from broken.ts', 'error', error)
 * ```
 */

// Detect environment from Convex deployment (dev in .env.local, prod in .env)
const isDev = Bun.env.CONVEX_ENVIRONMENT === 'dev'

// Initialize Convex client (singleton)
let convexClient: ConvexHttpClient | null = null

function getConvexClient(): ConvexHttpClient {
	if (!convexClient) {
		convexClient = new ConvexHttpClient(env.CONVEX_URL)
	}
	return convexClient
}

// Discord client for monitoring (set after client is ready)
let discordClient: Client | undefined

/**
 * Set the Discord client for monitoring
 * Should be called after the client is ready
 */
export function setDiscordClient(client: Client): void {
	discordClient = client
}

/**
 * Extract user/guild data from Discord interaction
 */
function extractInteractionData(
	interaction: CommandInteraction | StringSelectMenuInteraction
) {
	return {
		user_id: interaction.user.id,
		user_name: interaction.user.globalName || interaction.user.username,
		guild_name: interaction.guild?.name || 'Direct Message',
	}
}

/**
 * Format error for logging
 */
function formatError(error: unknown): string {
	if (error instanceof Error) {
		return error.message
	}
	return String(error)
}

/**
 * Get stack trace from error
 */
function getStackTrace(error: unknown): string | undefined {
	if (error instanceof Error && error.stack) {
		return error.stack
	}
	return undefined
}

/**
 * Simplified logger singleton
 */
export const logger = {
	/**
	 * Log a therapy session (CORE METRIC)
	 *
	 * Auto-extracts user/guild data from interaction.
	 * Logs to both therapy_sessions and command_logs tables.
	 * Always shows in console (even in production) with special formatting.
	 */
	therapy: (
		interaction: CommandInteraction,
		status: Status,
		error?: unknown
	): void => {
		const data = extractInteractionData(interaction)
		const errorMessage = error ? formatError(error) : undefined

		// Console log with special highlighting
		const symbol = status === 'success' ? '💚' : '❌'
		const statusText = status === 'success' ? 'SUCCESS' : 'ERROR'
		console.log(
			color(
				status === 'success' ? 'success' : 'error',
				`${symbol} THERAPY SESSION ${statusText} | User: ${data.user_name} | Guild: ${data.guild_name}${errorMessage ? ` | Error: ${errorMessage}` : ''}`
			)
		)

		// Send Discord alert for therapy errors (critical)
		if (status === 'error' && error instanceof Error) {
			sendTherapyError(
				error,
				data.user_name,
				data.guild_name,
				discordClient
			).catch((err) => {
				console.error(
					color(
						'error',
						`Failed to send therapy error alert: ${formatError(err)}`
					)
				)
			})
		}

		// Log to therapy_sessions table
		getConvexClient()
			.mutation(api.logger.logTherapy, {
				...data,
				status,
				error_message: errorMessage,
			})
			.catch((err) => {
				console.error(
					color('error', `Failed to log therapy session: ${formatError(err)}`)
				)
			})

		// Also log to command_logs for comprehensive tracking
		getConvexClient()
			.mutation(api.logger.logCommand, {
				...data,
				command_name: 'therapy',
				status,
				error_message: errorMessage,
			})
			.catch((err) => {
				console.error(
					color('error', `Failed to log therapy command: ${formatError(err)}`)
				)
			})
	},

	/**
	 * Log a command execution
	 *
	 * Auto-extracts user/guild data from interaction.
	 */
	command: (
		interaction: CommandInteraction | StringSelectMenuInteraction,
		commandName: CommandName,
		status: Status,
		error?: unknown
	): void => {
		const data = extractInteractionData(interaction)
		const errorMessage = error ? formatError(error) : undefined

		// Console log in dev
		if (isDev) {
			const symbol = status === 'success' ? '✓' : '✗'
			console.log(
				color(
					status === 'success' ? 'success' : 'error',
					`${symbol} Command: /${commandName} | User: ${data.user_name} | Guild: ${data.guild_name}${errorMessage ? ` | Error: ${errorMessage}` : ''}`
				)
			)
		}

		// Send Discord alert for command errors
		if (status === 'error' && error instanceof Error) {
			sendCommandError(
				commandName,
				error,
				data.user_name,
				data.guild_name,
				discordClient
			).catch((err) => {
				console.error(
					color(
						'error',
						`Failed to send command error alert: ${formatError(err)}`
					)
				)
			})
		}

		// Database log
		getConvexClient()
			.mutation(api.logger.logCommand, {
				...data,
				command_name: commandName,
				status,
				error_message: errorMessage,
			})
			.catch((err) => {
				console.error(
					color('error', `Failed to log command: ${formatError(err)}`)
				)
			})
	},

	/**
	 * Log a system event
	 *
	 * Generic system logging for bot lifecycle events.
	 *
	 * @param location - Where the log is from (e.g., "command-handler", "ready", "interaction-create")
	 * @param message - What happened (e.g., "Successfully loaded slash command: therapy")
	 * @param severity - Log level: info, success, error, warning
	 * @param error - Optional error object for stack trace
	 */
	system: (
		location: string,
		message: string,
		severity: Severity,
		error?: unknown
	): void => {
		const errorMessage = error ? formatError(error) : undefined
		const stackTrace = error ? getStackTrace(error) : undefined

		// Console log (always for errors/warnings, only in dev for info/success)
		if (severity === 'error' || severity === 'warning' || isDev) {
			const symbols = {
				info: '🤖',
				success: '✅',
				error: '❌',
				warning: '⚠️',
			}
			const colorType =
				severity === 'success'
					? 'success'
					: severity === 'error' || severity === 'warning'
						? 'error'
						: 'text'

			console.log(
				color(
					colorType,
					`${symbols[severity]} [${location}] ${message}${errorMessage ? ` | Error: ${errorMessage}` : ''}`
				)
			)

			if (stackTrace && isDev) {
				console.error(color('error', stackTrace))
			}
		}

		// Database log
		getConvexClient()
			.mutation(api.logger.logSystem, {
				location,
				message: errorMessage ? `${message}: ${errorMessage}` : message,
				severity,
				stack_trace: stackTrace,
			})
			.catch((err) => {
				console.error(
					color('error', `Failed to log system event: ${formatError(err)}`)
				)
			})
	},
}
