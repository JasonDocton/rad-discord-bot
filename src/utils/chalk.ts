import chalk from 'chalk'

// This file is purely for styling the console output. As the bot loads various commands, receives certain events, or encounters errors, the respective logs will be decorated with color.

type colorType = 'text' | 'variable' | 'success' | 'error'

const appColors = {
	text: '#F7F48B',
	variable: '#70A1D7',
	success: '#A1DE93',
	error: '#F47C7C',
}

export const getAppColors = (color: colorType) => Number(appColors[color].substring(1))

export const color = (color: colorType, text: string | unknown) => {
	if (color === 'error') {
		return chalk.hex(appColors[color]).bold(text)
	}
	return chalk.hex(appColors[color])(text)
}
