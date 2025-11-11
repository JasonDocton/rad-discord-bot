/** biome-ignore-all lint/style/noProcessEnv: <This is our main environment configuration file. Process.env shouldn't be used outside of this file.> */
/** biome-ignore lint/performance/noNamespaceImport: Zod documentation recommends using namespace here */
import * as z from 'zod/mini'

export function isConvexEnvironment(): boolean {
	return typeof process !== 'undefined' && !!process.env.CONVEX_CLOUD_URL
}

// Base schemas (without readonly for composition)
const botEnvSchemaBase = z.object({
	CONVEX_URL: z.string().check(z.url()),
	DISCORD_BOT_TOKEN: z.string(),
	DISCORD_CLIENT_ID: z.string(),
	DISCORD_MONITOR_CHANNEL_ID: z.optional(z.string()),
	DISCORD_MONITOR_WEBHOOK_URL: z.optional(z.string().check(z.url())),
	THERAPY_INTAKE_URL: z.string().check(z.url()),
})

const convexOnlyEnvSchemaBase = z.object({
	CONVEX_SITE_URL: z.string().check(z.url()),
})

// Discord bot environment variables (Bun runtime)
export const botEnvSchema = z.readonly(botEnvSchemaBase)

// Convex-only environment variables (used in Convex functions)
export const convexOnlyEnvSchema = z.readonly(convexOnlyEnvSchemaBase)

// Combined schema for Convex environment (bot + convex-only vars)
// Used only in Convex environment with strict validation
export const envSchema = z.readonly(
	z.object({
		...botEnvSchemaBase.shape,
		...convexOnlyEnvSchemaBase.shape,
	})
)

type ValidationIssue = {
	readonly path: readonly string[]
	readonly message: string
}

/**
 * Formats Zod validation errors into a human-readable string.
 * Each issue is displayed on a new line with its path and message.
 *
 * @param issues - Array of validation issues from Zod parse failure
 * @returns Formatted error string with bullet points
 * @example
 * // Returns:
 * // "  - VITE_CONVEX_URL: Expected string, received undefined
 * //   - NODE_ENV: Invalid enum value"
 */
export function formatValidationError(issues: ValidationIssue[]): string {
	return issues
		.map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
		.join('\n')
}

/**
 * Type guard to check if an error is a Zod validation error.
 * Validates that the error has an `issues` array property.
 *
 * @param error - Unknown error object to check
 * @returns True if error has validation issues, false otherwise
 */
export function isValidationError(
	error: unknown
): error is { issues: ValidationIssue[] } {
	return (
		error !== null &&
		typeof error === 'object' &&
		'issues' in error &&
		Array.isArray((error as { issues: unknown }).issues)
	)
}

export type Env = z.infer<typeof envSchema>

export function getRuntimeEnv(): Partial<Env> {
	const isConvex = isConvexEnvironment()

	if (isConvex) {
		return {
			CONVEX_URL: process.env.CONVEX_URL,
			CONVEX_SITE_URL: process.env.CONVEX_SITE_URL,
			DISCORD_BOT_TOKEN: process.env.DISCORD_BOT_TOKEN,
			DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
			THERAPY_INTAKE_URL: process.env.THERAPY_INTAKE_URL,
		}
	}

	// Discord bot (Bun runtime)
	return {
		CONVEX_URL: Bun.env.CONVEX_URL,
		DISCORD_BOT_TOKEN: Bun.env.DISCORD_BOT_TOKEN,
		DISCORD_CLIENT_ID: Bun.env.DISCORD_CLIENT_ID,
		DISCORD_MONITOR_CHANNEL_ID: Bun.env.DISCORD_MONITOR_CHANNEL_ID,
		DISCORD_MONITOR_WEBHOOK_URL: Bun.env.DISCORD_MONITOR_WEBHOOK_URL,
		THERAPY_INTAKE_URL: Bun.env.THERAPY_INTAKE_URL,
	}
}
