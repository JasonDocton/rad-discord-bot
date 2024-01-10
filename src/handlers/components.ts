import { Client, StringSelectMenuBuilder } from 'discord.js'
import { readdirSync } from 'fs'
import { join } from 'path'
import { SelectMenu } from '../types'

module.exports = (client: Client) => {
	const selectMenus: StringSelectMenuBuilder[] = []
	const selectMenuDir = join(__dirname, '../components/selectMenus')

	readdirSync(selectMenuDir).forEach((file) => {
		if (!file.endsWith('.ts')) return
		const component: SelectMenu = require(`${selectMenuDir}/${file}`).default
		selectMenus.push(component.component)
		client.selectMenus.set(component.name, component)
	})
}
