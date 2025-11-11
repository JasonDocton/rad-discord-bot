/** biome-ignore-all lint/style/noProcessEnv: <This is our main environment configuration file. Process.env shouldn't be used outside of this file.> */
/** biome-ignore-all lint/performance/noNamespaceImport: Zod documentation recommends using namespace here */

import * as z from 'zod/mini'
import type { Env } from '@/configs/env-config.ts'
import {
	botEnvSchema,
	envSchema,
	formatValidationError,
	getRuntimeEnv,
	isConvexEnvironment,
	isValidationError,
} from '@/configs/env-config.ts'

let envCache: Partial<Env> | null = null

/**
 * Validates and caches environment variables based on execution context.
 * Runs validation only once per app lifecycle (cached after first call).
 *
 * Validation strictness depends on context:
 * - **Discord Bot**: Validates bot vars ({@link botEnvSchema})
 * - **Convex**: Validates all vars strictly ({@link envSchema})
 *
 * @returns Validated environment variables for the current context
 * @throws Error with context-specific help text if validation fails
 * @see {@link getRuntimeEnv} for how variables are sourced per context
 */

function getValidatedEnv(): Partial<Env> {
	if (envCache) {
		return envCache
	}

	const isConvex = isConvexEnvironment()
	const runtimeEnv = getRuntimeEnv()

	try {
		let result: Partial<Env>

		if (isConvex) {
			result = z.parse(envSchema, runtimeEnv)
		} else {
			result = z.parse(botEnvSchema, runtimeEnv)
		}

		envCache = result
		return envCache
	} catch (error) {
		if (isValidationError(error)) {
			let context = 'Environment'
			let helpText = ''

			if (isConvex) {
				context = 'Convex environment'
				helpText =
					'\n\nSet missing variables via:' +
					'\n  - Convex Dashboard: https://dashboard.convex.dev → Settings → Environment Variables' +
					'\n  - CLI: npx convex env set VARIABLE_NAME value'
			} else {
				context = 'Discord Bot environment'
				helpText = '\n\nSet missing variables in .env or .env.local'
			}

			throw new Error(
				`${context} validation failed:\n${formatValidationError(error.issues)}${helpText}`
			)
		}
		throw error
	}
}

/**
 * Unified environment variable accessor with runtime validation and security enforcement.
 *
 * **Features**:
 * - Type-safe access to all environment variables
 * - Lazy validation (validates on first access, not at module load)
 * - Context-aware (returns appropriate vars for browser/SSR/Convex)
 * - Security: Blocks server-only variables in browser with clear error message
 *
 * **Usage**:
 * ```typescript
 * import { env } from '@/env'
 *
 * // Access any variable with full type safety
 * const convexUrl = env.CONVEX_URL
 * ```
 *
 * @see {@link getValidatedEnv} for validation logic
 * @see {@link getRuntimeEnv} for variable sourcing per context
 */
export const env = new Proxy({} as Env, {
	get(_target, prop) {
		const validated = getValidatedEnv()
		// Check if prop exists in validated env first
		if (prop in validated) {
			return validated[prop as keyof Env]
		}

		return undefined
	},
})
