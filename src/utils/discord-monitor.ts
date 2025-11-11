import type { Client, TextChannel } from 'discord.js'
import { EmbedBuilder } from 'discord.js'
import { env } from '@/env.ts'
import { color } from './color.ts'

/**
 * Discord monitoring utility
 *
 * Sends error and status notifications to a dedicated Discord channel.
 * Uses bot client when available, falls back to webhook when bot is down.
 *
 * Features:
 * - Rich embeds with color-coded severity
 * - Rate limiting to prevent spam
 * - Automatic fallback to webhook
 * - Smart error deduplication
 */

type Severity = 'info' | 'success' | 'error' | 'warning' | 'critical'

interface MonitorMessage {
	readonly title: string
	readonly message: string
	readonly severity: Severity
	readonly location?: string
	readonly stackTrace?: string
	readonly metadata?: Record<string, unknown>
}

interface RateLimitEntry {
	readonly count: number
	readonly firstSeen: number
	readonly lastSeen: number
}

/**
 * Rate limiter for monitoring messages
 * Prevents spam by tracking message keys and enforcing limits
 */
class MonitorRateLimiter {
	private readonly limits = new Map<string, RateLimitEntry>()
	private readonly maxMessagesPerHour = 10
	private readonly windowMs = 60 * 60 * 1000 // 1 hour
	private readonly cleanupIntervalMs = 5 * 60 * 1000 // 5 minutes

	constructor() {
		// Periodically clean up old entries
		setInterval(() => this.cleanup(), this.cleanupIntervalMs)
	}

	/**
	 * Check if message should be allowed (not rate limited)
	 */
	shouldAllow(key: string): boolean {
		const now = Date.now()
		const entry = this.limits.get(key)

		if (!entry) {
			// First time seeing this message
			this.limits.set(key, {
				count: 1,
				firstSeen: now,
				lastSeen: now,
			})
			return true
		}

		// Check if window has expired
		if (now - entry.firstSeen > this.windowMs) {
			// Reset window
			this.limits.set(key, {
				count: 1,
				firstSeen: now,
				lastSeen: now,
			})
			return true
		}

		// Within window - check count
		if (entry.count >= this.maxMessagesPerHour) {
			return false
		}

		// Increment count
		this.limits.set(key, {
			count: entry.count + 1,
			firstSeen: entry.firstSeen,
			lastSeen: now,
		})
		return true
	}

	/**
	 * Clean up expired entries
	 */
	private cleanup(): void {
		const now = Date.now()
		for (const [key, entry] of this.limits.entries()) {
			if (now - entry.lastSeen > this.windowMs) {
				this.limits.delete(key)
			}
		}
	}
}

// Singleton rate limiter
const rateLimiter = new MonitorRateLimiter()

/**
 * Generate a unique key for rate limiting
 */
function generateRateLimitKey(msg: MonitorMessage): string {
	return `${msg.severity}:${msg.title}:${msg.location || 'global'}`
}

/**
 * Get embed color based on severity
 */
function getSeverityColor(severity: Severity): number {
	const colors = {
		info: 0x3498db, // Blue
		success: 0x2ecc71, // Green
		warning: 0xf39c12, // Yellow/Orange
		error: 0xe74c3c, // Red
		critical: 0x992d22, // Dark Red
	}
	return colors[severity]
}

/**
 * Get emoji for severity
 */
function getSeverityEmoji(severity: Severity): string {
	const emojis = {
		info: '💡',
		success: '✅',
		warning: '⚠️',
		error: '❌',
		critical: '🚨',
	}
	return emojis[severity]
}

/**
 * Build Discord embed for monitoring message
 */
function buildEmbed(msg: MonitorMessage): EmbedBuilder {
	const embed = new EmbedBuilder()
		.setTitle(`${getSeverityEmoji(msg.severity)} ${msg.title}`)
		.setDescription(msg.message)
		.setColor(getSeverityColor(msg.severity))
		.setTimestamp()

	if (msg.location) {
		embed.addFields({ name: 'Location', value: msg.location, inline: true })
	}

	if (msg.metadata) {
		const metadataStr = Object.entries(msg.metadata)
			.map(([key, value]) => `**${key}**: ${String(value)}`)
			.join('\n')
		if (metadataStr) {
			embed.addFields({ name: 'Details', value: metadataStr })
		}
	}

	if (msg.stackTrace) {
		// Truncate stack trace if too long (Discord field limit is 1024)
		const truncated =
			msg.stackTrace.length > 1000
				? `${msg.stackTrace.substring(0, 1000)}...`
				: msg.stackTrace
		embed.addFields({
			name: 'Stack Trace',
			value: `\`\`\`\n${truncated}\n\`\`\``,
		})
	}

	return embed
}

/**
 * Send message via bot client (preferred method)
 */
async function sendViaBot(
	client: Client,
	channelId: string,
	embed: EmbedBuilder
): Promise<boolean> {
	try {
		const channel = await client.channels.fetch(channelId)
		if (!channel || !channel.isTextBased()) {
			console.error(
				color('error', 'Monitor channel not found or not text-based')
			)
			return false
		}

		await (channel as TextChannel).send({ embeds: [embed] })
		return true
	} catch (error) {
		console.error(
			color('error', `Failed to send monitoring message via bot: ${error}`)
		)
		return false
	}
}

/**
 * Send message via webhook (fallback method)
 */
async function sendViaWebhook(
	webhookUrl: string,
	embed: EmbedBuilder
): Promise<boolean> {
	try {
		const response = await fetch(webhookUrl, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ embeds: [embed.toJSON()] }),
		})

		if (!response.ok) {
			console.error(
				color('error', `Webhook request failed with status ${response.status}`)
			)
			return false
		}

		return true
	} catch (error) {
		console.error(
			color('error', `Failed to send monitoring message via webhook: ${error}`)
		)
		return false
	}
}

/**
 * Send monitoring message to Discord
 *
 * Tries bot client first, falls back to webhook if bot is unavailable.
 * Includes rate limiting to prevent spam.
 */
export async function sendMonitorMessage(
	msg: MonitorMessage,
	client?: Client
): Promise<void> {
	// Rate limiting check
	const rateLimitKey = generateRateLimitKey(msg)
	if (!rateLimiter.shouldAllow(rateLimitKey)) {
		console.log(color('text', `Rate limited: ${msg.title} (${rateLimitKey})`))
		return
	}

	const embed = buildEmbed(msg)

	// Try bot client first
	if (client?.isReady() && env.DISCORD_MONITOR_CHANNEL_ID) {
		const success = await sendViaBot(
			client,
			env.DISCORD_MONITOR_CHANNEL_ID,
			embed
		)
		if (success) {
			return
		}
	}

	// Fallback to webhook
	if (env.DISCORD_MONITOR_WEBHOOK_URL) {
		await sendViaWebhook(env.DISCORD_MONITOR_WEBHOOK_URL, embed)
	} else {
		console.error(
			color(
				'error',
				'Cannot send monitoring message: no bot client or webhook configured'
			)
		)
	}
}

/**
 * Send bot startup notification
 */
export async function sendBotStartup(client?: Client): Promise<void> {
	await sendMonitorMessage(
		{
			title: 'Bot Started',
			message:
				'RAD Discord Bot has successfully started and is ready to serve.',
			severity: 'success',
			location: 'ready',
		},
		client
	)
}

/**
 * Send bot crash notification
 */
export async function sendBotCrash(
	error: Error,
	location: string
): Promise<void> {
	await sendMonitorMessage({
		title: 'Bot Crashed',
		message: `The bot has encountered a critical error and may be down.`,
		severity: 'critical',
		location,
		stackTrace: error.stack,
		metadata: {
			error: error.message,
		},
	})
}

/**
 * Send command error notification
 */
export async function sendCommandError(
	commandName: string,
	error: Error,
	userName: string,
	guildName: string,
	client?: Client
): Promise<void> {
	await sendMonitorMessage(
		{
			title: `Command Error: /${commandName}`,
			message: 'A user encountered an error while executing a command.',
			severity: 'error',
			location: 'command-execution',
			stackTrace: error.stack,
			metadata: {
				command: commandName,
				user: userName,
				guild: guildName,
				error: error.message,
			},
		},
		client
	)
}

/**
 * Send therapy command error notification (high priority)
 */
export async function sendTherapyError(
	error: Error,
	userName: string,
	guildName: string,
	client?: Client
): Promise<void> {
	await sendMonitorMessage(
		{
			title: '🚨 Therapy Command Failed',
			message:
				'The therapy command failed! This is a critical feature - users are being impacted.',
			severity: 'critical',
			location: 'therapy-command',
			stackTrace: error.stack,
			metadata: {
				user: userName,
				guild: guildName,
				error: error.message,
			},
		},
		client
	)
}
