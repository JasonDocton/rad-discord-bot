import { SlashCommandBuilder, EmbedBuilder } from 'discord.js'
import { SlashCommand } from '../types'

const command: SlashCommand = {
	command: new SlashCommandBuilder().setName('therapy').setDescription('Start seeing a therapist with Rise Above The Disorder.'),

	execute: (interaction) => {
		interaction.reply({
			ephemeral: true,
			content:
				"Hey there! I'd be happy to help you start therapy! I'll link the steps below 😊. Once you've completed the intake form, one of our mental health professionals will reach out to schedule a call with you. This call can be done with or without video.",
			embeds: [
				new EmbedBuilder()
					.setTitle('How To Start Therapy With RAD')
					.setColor('#60a5fa')
					.setDescription(
						'```ansi\n[2;37m1. Fill out our intake form.[0m\n[2;37m[2;34m2. Talk with one of our social workers.[0m\n[2;37m[2;36m3. Start seeing a therapist local to you 💚.[0m```'
					)
					.setFooter({
						text: "❧Please note, it may take our team a few days to contact you, as we're expecting a lot of requests with the launch of this program.",
					}),
			],
			components: [
				{
					type: 1,
					components: [
						{
							style: 5,
							label: `📝 Intake Form`,
							url: `https://intakeq.com/new/KT5Fej/xs2lkh`,
							disabled: false,
							type: 2,
						},
					],
				},
			],
		})
	},
}

export default command
