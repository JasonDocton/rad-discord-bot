import type { MessageEditOptions } from 'discord.js'

export const DepressionContent: MessageEditOptions = {
	embeds: [
		{
			title: 'What is Depression? 😕',
			color: 0x5d6cc0,
			description:
				"Depression is a mental health disorder that affects how a person feels, thinks, and behaves. It is characterized by persistent feelings of sadness, hopelessness, and loss of interest in activities that were once enjoyed. Depression can have a severe impact on a person's quality of life and can interfere with their ability to work, study, and maintain relationships.",
		},
		{
			title: 'What are the symptoms of Depression? 🤔',
			color: 0x242323,
			description:
				'While everyone experiences feelings of sadness and loss of interest in activities from time to time, depression is different. It is a serious mental health condition that can have a significant impact on a person’s ability to function. Some common symptoms of depression include:',

			fields: [
				{
					name: 'Physical Symptoms',
					value:
						'Feeling tired all the time.\nLoss of appetite or overeating.\nSleeping too much or too little.\nFeeling agitated or restless.\nAches or pains, headaches, cramps, or digestive problems without a clear physical cause',
					inline: true,
				},
				{
					name: 'Mental Symptoms',
					value:
						'Feeling sad, empty, or hopeless.\nFeeling worthless or guilty.\nHaving trouble concentrating, remembering, or making decisions.\nLoss of interest or pleasure in hobbies and activities.\nThoughts of death or suicide',
					inline: true,
				},
			],
		},
		{
			title: 'How is depression diagnosed? ✍️',
			color: 0x242323,
			description:
				'Depression is typically diagnosed by a mental health professional, such as a psychiatrist, psychologist, or licensed clinical social worker based on a detailed interview and assessment of symptoms. A mental health professional will often make a diagnosis based on the length of time symptoms of depression have been present; as well as, the frequency and severity of the symptoms.\n\nIt is important to note that there are different types of depression, including Major Depression, Persistent Depressive Disorder, and Seasonal Affective Disorder - to name a few.',
		},
		{
			title: 'How is depression treated? ⚕️',
			color: 0x242323,
			description:
				"The specific treatment plan will depend on the severity of the depression, the patient's preferences, and any other medical conditions the patient may have. Depression is typically treated with a combination of the following: ",
			fields: [
				{
					name: 'Psychotherapy',
					value:
						'Cognitive Behavioral Therapy (CBT) and Mindfulness Based Cognitive Therapy (MBCT) are the most common types of therapy used to treat depression. These therapies focus on changing negative thought patterns and behaviors, while building emotional resilience.',
				},
				{
					name: 'Medication',
					value:
						"There are several types of medication used to treat depression, including selective serotonin reuptake inhibitors (SSRIs), serotonin and norepinephrine reuptake inhibitors (SNRIs), tricyclic antidepressants (TCAs), and monoamine oxidase inhibitors (MAOIs). These medications work by changing the levels of certain chemicals in the brain called neurotransmitters, which play a role in mood regulation. It's important to note that medication should always be used in conjunction with therapy and other lifestyle changes for best results. It's also important to work closely with a mental health professional to find the right medication and dosage.",
				},
				{
					name: 'Lifestyle Changes',
					value:
						'Regular exercise, getting enough sleep, and eating a healthy diet can also help to alleviate symptoms of depression and improve overall well-being.',
				},
			],
			footer: {
				text: '--\nIt is important to work with a mental health professional to determine the best treatment approach for your specific needs. In some cases, a combination of treatments may be most effective.',
			},
		},
	],
}
