import { Client, Message } from "discord.js";
import { ChannelTypes } from "discord.js/typings/enums";
import { IConfig } from "../config";
import { collectionToArray, throwErr } from "../util";

/**
 * TCommand represents a function for processing a single command.
 */
export type TCommand = (
	config: IConfig,
	client: Client
) => (msg: Message, args: string[]) => Promise<void>;

export const hello: TCommand =
	(config: IConfig, client: Client) =>
	async (msg: Message, args: string[]): Promise<void> => {
		msg.reply("goodbye");
	};

export const attachToVoiceChannel: TCommand =
	(config: IConfig, client: Client) =>
	async (msg: Message, args: string[]): Promise<void> => {
		const name = args.join(" ");
		const channels = msg?.guild?.channels.cache.filter(
			(c) => c.name == name && c.type == "GUILD_VOICE"
		);
		let [vcId, vc] =
			(channels && collectionToArray(channels)[0]) ||
			throwErr(
				`voice channel ${name} not found in guild ${
					msg?.guild?.name || "unknown guild"
				}`
			);
		msg.reply(`Found VC with ID ${vcId}`);
	};
