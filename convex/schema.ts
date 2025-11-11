import { defineSchema, defineTable } from 'convex/server'
import type { Infer } from 'convex/values'
import { v } from 'convex/values'

/**
 * Database schema for RAD Discord Bot
 *
 * Tables:
 * - therapy_sessions: Core metric - tracks every therapy command usage
 * - command_logs: Tracks all command usage across the bot
 * - system_logs: Bot lifecycle events (startup, command loading, errors)
 */

/**
 * Shared validator for user interaction logs
 * Convex 1.29.0: Using base validator with .extend() to reduce duplication
 */
const baseUserLogValidator = v.object({
	user_id: v.string(),
	user_name: v.string(),
	guild_name: v.string(),
	status: v.union(v.literal('success'), v.literal('error')),
	error_message: v.optional(v.string()),
})

/**
 * Shared validator for command names across the bot
 */
const commandNameValidator = v.union(
	v.literal('about'),
	v.literal('faq'),
	v.literal('hotlines'),
	v.literal('library'),
	v.literal('therapy')
)

const schema = defineSchema({
	/**
	 * Therapy Sessions - Core Metric Table
	 *
	 * Tracks every use of the /therapy command for easy reporting.
	 * This is the primary success metric for the application.
	 *
	 * Indexes:
	 * - by_user: Query all therapy sessions by a specific user
	 * - by_status: Query by success/error status
	 */
	therapy_sessions: defineTable(baseUserLogValidator)
		.index('by_user', ['user_id'])
		.index('by_status', ['status']),

	/**
	 * Command Logs - All Command Usage
	 *
	 * Tracks usage of all bot commands (about, faq, hotlines, library, therapy).
	 * For therapy-specific analysis, use therapy_sessions table instead.
	 *
	 * Indexes:
	 * - by_command: Query usage of a specific command
	 * - by_user: Query all commands used by a specific user
	 * - by_status: Query by success/error status
	 */
	command_logs: defineTable(
		baseUserLogValidator.extend({
			command_name: commandNameValidator,
		})
	)
		.index('by_command', ['command_name'])
		.index('by_user', ['user_id'])
		.index('by_status', ['status']),

	/**
	 * System Logs - Bot Lifecycle Events
	 *
	 * Tracks system events with a simple, flexible schema.
	 * Each log records where it came from (location), what happened (message),
	 * and the severity level.
	 *
	 * Locations:
	 * - "command-handler": Loading slash commands
	 * - "event-handler": Loading events
	 * - "component-handler": Loading select menus
	 * - "ready": Bot startup
	 * - "interaction-create": Interaction handling
	 * - etc.
	 *
	 * Indexes:
	 * - by_location: Query logs from a specific location
	 * - by_severity: Query by severity level
	 */
	system_logs: defineTable({
		location: v.string(),
		message: v.string(),
		severity: v.union(
			v.literal('info'),
			v.literal('success'),
			v.literal('error'),
			v.literal('warning')
		),
		stack_trace: v.optional(v.string()),
	})
		.index('by_location', ['location'])
		.index('by_severity', ['severity']),
})

// biome-ignore lint/style/noDefaultExport: Required by Convex
export default schema

/**
 * Exported validators for reuse in mutations and type inference
 * Convex 1.29.0: Validators can be exported and reused across files
 */
export { baseUserLogValidator, commandNameValidator }

/**
 * Helper types exported from schema
 */
type CommandLog = Infer<typeof schema.tables.command_logs.validator>
export type CommandName = CommandLog['command_name']

type SystemLog = Infer<typeof schema.tables.system_logs.validator>
export type Severity = SystemLog['severity']

type TherapySession = Infer<typeof schema.tables.therapy_sessions.validator>
export type Status = TherapySession['status']
