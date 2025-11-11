import type {
	AutocompleteInteraction,
	Collection,
	CommandInteraction,
	SlashCommandBuilder,
	StringSelectMenuBuilder,
	StringSelectMenuInteraction,
} from 'discord.js'

// The following interfaces are used to give us some type safe structures to work with as we build out our bot.

export interface SlashCommand {
	readonly command: SlashCommandBuilder
	readonly execute: (interaction: CommandInteraction) => void
	readonly autocomplete?: (interaction: AutocompleteInteraction) => void
}

export interface SelectMenu {
	readonly name: string
	readonly component: StringSelectMenuBuilder
	readonly execute: (interaction: StringSelectMenuInteraction) => void
}

export interface BotEvent {
	readonly name: string
	readonly displayName?: string
	readonly once?: boolean
	readonly execute: (...args: unknown[]) => void
}

declare module 'discord.js' {
	export interface Client {
		slashCommands: Collection<string, SlashCommand>
		selectMenus: Collection<string, SelectMenu>
	}
}
