import {
	AutocompleteInteraction,
	Collection,
	CommandInteraction,
	SlashCommandBuilder,
	StringSelectMenuBuilder,
	StringSelectMenuInteraction,
} from 'discord.js'

// The following interfaces are used to give us some type safe structures to work with as we build out our bot.

export interface SlashCommand {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	command: SlashCommandBuilder | any
	execute: (interaction: CommandInteraction) => void
	autocomplete?: (interaction: AutocompleteInteraction) => void
}

export interface SelectMenu {
	name: string
	component: StringSelectMenuBuilder
	execute: (interaction: StringSelectMenuInteraction) => void
}

export interface BotEvent {
	name: string
	displayName?: string
	once?: boolean | false
	execute: (...args) => void
}

declare module 'discord.js' {
	export interface Client {
		slashCommands: Collection<string, SlashCommand>
		selectMenus: Collection<string, SelectMenu>
	}
}
