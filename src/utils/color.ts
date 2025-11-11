/**
 * Console color utilities for RAD Discord Bot
 *
 * Provides consistent color styling for terminal output and Discord embeds.
 * Uses a predefined color palette for different message types.
 *
 * Color palette:
 * - text: Soft yellow (#F7F48B) - General information
 * - variable: Blue (#70A1D7) - Variable values and data
 * - success: Green (#A1DE93) - Success messages
 * - error: Red (#F47C7C) - Error messages (bold in console)
 */

import chalk from 'chalk'

type ColorType = 'text' | 'variable' | 'success' | 'error'

const appColors = {
	text: '#F7F48B',
	variable: '#70A1D7',
	success: '#A1DE93',
	error: '#F47C7C',
} as const

/**
 * Converts hex color to decimal number for Discord embeds
 *
 * Discord's embed API requires colors as decimal integers, not hex strings.
 * This function converts our hex color palette to the required format.
 *
 * @param color - Color type from the palette
 * @returns Decimal color value (e.g., 0xF7F48B becomes 16250763)
 *
 * @example
 * ```ts
 * const embedColor = getAppColors('success')
 * embed.setColor(embedColor) // Sets green color
 * ```
 */
export const getAppColors = (color: ColorType): number =>
	Number.parseInt(appColors[color].substring(1), 16)

/**
 * Applies color styling to console output text
 *
 * Uses chalk to colorize terminal output with our color palette.
 * Error messages are automatically bolded for emphasis.
 *
 * @param color - Color type to apply
 * @param text - Text to colorize
 * @returns Chalk-formatted string for console output
 *
 * @example
 * ```ts
 * console.log(color('success', 'Bot started successfully'))
 * console.log(color('error', 'Failed to connect'))
 * ```
 */
export const color = (color: ColorType, text: string): string => {
	if (color === 'error') {
		return chalk.hex(appColors[color]).bold(text)
	}
	return chalk.hex(appColors[color])(text)
}
