import type { MessageEditOptions } from 'discord.js'

export const AnxietyContent: MessageEditOptions = {
	embeds: [
		{
			title: 'What is Anxiety? 😰',
			color: 0xff003c,
			description:
				'Anxiety is a feeling of unease, such as worry or fear, that can be mild or severe. Anxiety disorders are serious mental health issues that involve excessive and persistent worry and fear that are disabling and distressing. They can interfere with daily activities such as job performance, school work, and relationships.',
		},
		{
			title: 'What are the signs and symptoms of anxiety? 🤔',
			color: 0x242323,
			description:
				'Anxiety can manifest in many different ways, often depending on the type of anxiety disorder. Some common signs and symptoms of anxiety include:',

			fields: [
				{
					name: 'Physical Symptoms',
					value:
						'Light-headed, dizzy, or faint.\nNausea or upset stomach.\nTrembling or shaking.\nShortness of breath.\nHot flashes or chills.\nSweating.\nTightness in the chest.\nMuscle tension.\nHeadaches.\nFatigue.\nRestlessness.\nSleep problems (insomnia or excessive sleeping).\nIncreased or irregular heartbeat.',
					inline: true,
				},
				{
					name: 'Mental Symptoms',
					value:
						'Feeling tense, on-edge, and unable to relax.\nFeeling you may be losing your mind.\nSense of impending doom, as if something terrible may be happening.\nFeeling disconnected from the world or from yourself.\nExcess fear and worry.\nInability to focus on daily tasks.',
					inline: true,
				},
			],
		},
		{
			title: 'How are anxiety disorders diagnosed? ✍️',
			color: 0x242323,
			description:
				'Anxiety disorders are generally diagnosed by a mental health professional, such as a psychiatrist, psychologist, or clinical social worker, based on a detailed interview and assessment of symptoms. While feelings of anxiety are normal, persistent anxiety that interferes with daily life may be a sign of an anxiety disorder.\n\nAnxiety disorders are often classified by their symptoms and the situations in which they occur. For example, panic disorder is diagnosed when a person experiences unexpected panic attacks and has anxiety about having another one. Social anxiety disorder is diagnosed when a person experiences extreme anxiety in social situations where they may be judged by others.',
		},
		{
			title: 'How are anxiety disorders treated? ⚕️',
			color: 0x242323,
			description:
				'There are several effective treatment options for anxiety disorders, including:',
			fields: [
				{
					name: 'Psychotherapy',
					value:
						'Also known as talk therapy or counseling, involves talking with a mental health professional to identify and address the thoughts, feelings, and behaviors that contribute to anxiety. There are several types of psychotherapy that can be effective for treating anxiety disorders, including cognitive-behavioral therapy (CBT), exposure therapy, and acceptance and commitment therapy (ACT).',
				},
				{
					name: 'Medication',
					value:
						'There are several medications that can be effective in reducing symptoms of anxiety, including selective serotonin reuptake inhibitors (SSRIs), serotonin-norepinephrine reuptake inhibitors (SNRIs), and benzodiazepines.',
				},
				{
					name: 'Lifestyle Changes',
					value:
						'Making certain changes to your lifestyle can also help reduce symptoms of anxiety. This may include getting regular exercise, getting enough sleep, eating a healthy diet, and reducing stress.',
				},
			],
			footer: {
				text: '--\nIt is important to work with a mental health professional to determine the best treatment approach for your specific needs. In some cases, a combination of treatments may be most effective.',
			},
		},
	],
}
