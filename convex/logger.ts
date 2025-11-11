import { v } from 'convex/values'
import { mutation } from './_generated/server'
import { baseUserLogValidator, commandNameValidator } from './schema'

/**
 * Log a therapy session - CORE METRIC
 *
 * Convex 1.29.0: Using shared validators from schema for consistency
 */
export const logTherapy = mutation({
	args: baseUserLogValidator,
	handler: async (ctx, args) => {
		await ctx.db.insert('therapy_sessions', args)
	},
})

/**
 * Log any command usage
 *
 * Convex 1.29.0: Using .extend() to add command_name to base validator
 */
export const logCommand = mutation({
	args: baseUserLogValidator.extend({
		command_name: commandNameValidator,
	}),
	handler: async (ctx, args) => {
		await ctx.db.insert('command_logs', args)
	},
})

/**
 * Log system event (generic)
 */
export const logSystem = mutation({
	args: {
		location: v.string(),
		message: v.string(),
		severity: v.union(
			v.literal('info'),
			v.literal('success'),
			v.literal('error'),
			v.literal('warning')
		),
		stack_trace: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		await ctx.db.insert('system_logs', args)
	},
})
