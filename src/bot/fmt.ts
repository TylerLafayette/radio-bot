import { MessageEmbed } from "discord.js";

/**
 * Creates an error embed with the supplied message.
 */
export const errorEmbed = (err: any) => ({
	title: `Uh oh!`,
	description: `There was a problem with your command that broke our code 🥺`,
	color: 0xfd2c44,
	fields: [
		{
			name: `Error:`,
			value: `${err}`,
			inline: true,
		},
	],
});

/**
 * Creates a generic embed message.
 */
export const genericMessage = (title: string, description: string) => ({
	title: `${title}`,
	description: `${description}`,
	color: 0x41c75c,
});
