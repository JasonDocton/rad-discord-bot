import type { MessageEditOptions } from 'discord.js'

export const PanicContent: MessageEditOptions = {
	embeds: [
		{
			title: 'What is a Panic Attack? ⚠️',
			color: 0xff9143,
			description:
				'A panic attack is a sudden and unexpected episode of intense fear or anxiety that is accompanied by physical symptoms such as a rapid heartbeat, sweating, shaking, shortness of breath, chest pain, and feelings of impending doom. Panic attacks usually peak within 10 minutes and can last for several minutes to an hour; rarely, an attack may last for hours or days.\n\nFrequent panic attacks can be a symptom of [panic disorder](https://www.nimh.nih.gov/health/publications/panic-disorder-when-fear-overwhelms "Click to learn more about Panic Disorder"), a type of anxiety disorder. People with panic disorder experience recurrent and unexpected panic attacks, and fear having another attack.',
		},
		{
			title: 'What are the signs and symptoms of a panic attack? 🤔',
			color: 0x242323,
			description:
				'The symptoms of a panic attack can vary from person to person, but they typically include a combination of the following:',

			fields: [
				{
					name: 'Physical Symptoms',
					value:
						'Rapid heartbeat or palpitations.\nSweating.\nShaking or trembling.\nShortness of breath.\nChest pain or discomfort.\nNausea or abdominal distress.\nDizziness or lightheadedness.\nChills or hot flashes.\nNumbness or tingling.',
					inline: true,
				},
				{
					name: 'Mental Symptoms',
					value:
						'Sudden and unexpected feelings of intense fear or anxiety.\nFeeling detached from oneself.\nFear of losing control or going crazy.\nA sense of impending doom or the belief that one may be dying.\n',
					inline: true,
				},
			],
		},

		{
			title: 'How do you stop a panic attack? ⚕️',
			color: 0x242323,
			description:
				'Stopping a panic attack can be challenging, but there are several strategies that may help to alleviate symptoms and calm the body and mind:',
			fields: [
				{
					name: 'Deep breathing',
					value:
						'Slow, deep breaths can help to slow down your heartbeat and reduce feelings of anxiety. Try breathing in through your nose for a count of four, holding for a moment, and exhaling through your mouth for a count of eight.',
				},
				{
					name: 'Progressive muscle relaxation',
					value:
						'Tense and then relax different muscle groups in your body, starting with your feet and working your way up to your head.',
				},
				{
					name: 'Grounding techniques',
					value:
						'Grounding techniques such as naming five things you can see, four things you can touch, three things you can hear, two things you can smell and one thing you can taste can help to bring you back to the present moment and reduce feelings of panic and anxiety.',
				},
				{
					name: 'Positive self-talk',
					value:
						'Challenging and reframing negative thoughts and replacing them with positive self-talk can help to reduce anxiety and panic.',
				},
				{
					name: 'Distraction',
					value:
						'Engaging in an activity such as reading, listening to music or solving a puzzle can help to take your mind off the panic attack and reduce symptoms',
				},
			],
			footer: {
				text: "--\nIf you experience panic attacks frequently, it's important to seek professional help from a therapist or counselor. They will be able to help you identify and address the underlying causes of your panic attacks and develop a treatment plan to reduce their frequency and intensity.",
			},
		},
	],
}
