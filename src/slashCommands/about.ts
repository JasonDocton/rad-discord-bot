import { SlashCommandBuilder } from 'discord.js'
import { SlashCommand } from '../types'

const command: SlashCommand = {
	command: new SlashCommandBuilder().setName('about').setDescription('Learn more about Radbot and this program.'),

	execute: (interaction) => {
		interaction.reply({
			ephemeral: true,
			embeds: [
				{
					title: `About Radbot`,
					description:
						"```ansi\n[2;37mMy name is [2;36mMay[0m[2;37m, and I'm here to help you access mental health care through [2;33mRise Above The Disorder[0m[2;37m. If you'd like assistance starting therapy, type [2;34m/therapy[0m[2;37m. Use [2;35m/faq[0m[2;37m to see a list of common questions I receive, or [2;32m/library[0m[2;37m to access my library of mental health information.[0m\n\n𝙲𝚛𝚎𝚊𝚝𝚎𝚍 𝚋𝚢 𝚁𝚒𝚜𝚎 𝙰𝚋𝚘𝚟𝚎 𝚃𝚑𝚎 𝙳𝚒𝚜𝚘𝚛𝚍𝚎𝚛\n[2;45m[2;37m𝒚𝒐𝒖𝒂𝒓𝒆𝒓𝒂𝒅.𝒐𝒓𝒈[0m[2;45m[0m```",
					color: 0x92a2ff,
					image: {
						url: `https://res.cloudinary.com/df23ubjbb/image/upload/v1673025442/Store/JasonDocton_anime_space_90s_fa39186e-27df-4892-b34c-67b68f7f5820_zo8exf.png`,
						height: 0,
						width: 0,
					},
				},
			],
		})
	},
}

export default command
