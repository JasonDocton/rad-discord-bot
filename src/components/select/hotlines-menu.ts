import { StringSelectMenuBuilder } from 'discord.js'
import { Hotlines } from '@/content/hotlines.ts'
import type { SelectMenu } from '@/types.ts'
import { logger } from '@/utils/logger.ts'

/**
 * Hotlines Select Menu Component (Part 1: A-M)
 *
 * Interactive dropdown menu for the /hotlines command that provides
 * mental health crisis hotline numbers by country.
 *
 * This menu covers countries A-M (first half alphabetically).
 * Discord limits select menus to 25 options, so we split into two menus.
 *
 * Features:
 * - Multiple hotlines per country where available
 * - Suicide prevention and mental health support resources
 * - Covers 20+ countries (A-M)
 */
const HotlinesMenuAM: SelectMenu = {
	name: 'hotlines-menu-am',
	component: new StringSelectMenuBuilder()
		.setCustomId('hotlines-menu-am')
		.setPlaceholder('Select your country (A-M)')
		.setOptions(
			Hotlines.filter((h) => h.value.charAt(0) <= 'M').map((hotline) => ({
				label: hotline.value,
				description: 'View mental health hotlines',
				value: hotline.value,
			}))
		),

	execute: (interaction) => {
		try {
			const { values } = interaction
			const selectedCountry = Hotlines.find(
				(hotline) => hotline.value === values[0]
			)

			if (selectedCountry) {
				interaction.update({
					embeds: [
						{
							title: `🆘 Crisis Hotlines - ${selectedCountry.value}`,
							description: selectedCountry.data,
							color: 0xff6b6b,
							footer: {
								text: 'If you are in immediate danger, please contact local emergency services (911, 999, 112, etc.)',
							},
						},
					],
				})
			}
		} catch (error) {
			logger.system(
				'select-menu:hotlines-am',
				'Hotlines menu (A-M) interaction failed',
				'error',
				error
			)
		}
	},
}

/**
 * Hotlines Select Menu Component (Part 2: N-Z)
 *
 * Interactive dropdown menu for the /hotlines command that provides
 * mental health crisis hotline numbers by country.
 *
 * This menu covers countries N-Z (second half alphabetically).
 */
const HotlinesMenuNZ: SelectMenu = {
	name: 'hotlines-menu-nz',
	component: new StringSelectMenuBuilder()
		.setCustomId('hotlines-menu-nz')
		.setPlaceholder('Select your country (N-Z)')
		.setOptions(
			Hotlines.filter((h) => h.value.charAt(0) > 'M').map((hotline) => ({
				label: hotline.value,
				description: 'View mental health hotlines',
				value: hotline.value,
			}))
		),

	execute: (interaction) => {
		try {
			const { values } = interaction
			const selectedCountry = Hotlines.find(
				(hotline) => hotline.value === values[0]
			)

			if (selectedCountry) {
				interaction.update({
					embeds: [
						{
							title: `🆘 Crisis Hotlines - ${selectedCountry.value}`,
							description: selectedCountry.data,
							color: 0xff6b6b,
							footer: {
								text: 'If you are in immediate danger, please contact local emergency services (911, 999, 112, etc.)',
							},
						},
					],
				})
			}
		} catch (error) {
			logger.system(
				'select-menu:hotlines-nz',
				'Hotlines menu (N-Z) interaction failed',
				'error',
				error
			)
		}
	},
}

export { HotlinesMenuAM, HotlinesMenuNZ }
