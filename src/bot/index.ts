import { Client, Intents, Message } from "discord.js";

import { IConfig } from "../config";
import * as commands from "./commands";

/**
 * Creates an event handler on a Discord.js Client that automatically
 * removes itself after one callback.
 */
const onWithRemove = (client: Client, event: string, callback: Function) => {
	const callbackWithRemove = (...args: any[]) => {
		callback(...args);
		client.off(event, callbackWithRemove);
	};

	client.on(event, callbackWithRemove);
};

/**
 * Logs the bot in and returns a Discord.js Client on success.
 */
const login = (token: string): Promise<Client> =>
	new Promise((resolve, reject) => {
		const client = new Client({
			intents: [
				Intents.FLAGS.GUILDS,
				Intents.FLAGS.GUILD_MESSAGES,
				Intents.FLAGS.DIRECT_MESSAGES,
			],
		});

		onWithRemove(client, "ready", () => resolve(client));
		onWithRemove(client, "error", (error: Error) => reject(error));

		client.login(token);
	});

export const handleMessage =
	(config: IConfig, client: Client) => async (msg: Message) => {
		const { content } = msg;

		// If the message doesn't start with the prefix, ignore it.
		if (!content.startsWith(config.prefix)) return;

		// Strip the prefix from the command.
		const withoutPrefix = content.substr(config.prefix.length);

		// Split the message by spaces and use the first
		// word as the command.
		const [command, ...args] = withoutPrefix.split(" ");

		if (!(commands as any)[command]) return;

		// Call the command.
		try {
			await (commands as any)[command](config, client)(msg, args);
		} catch (err) {
			msg.reply(`Error occurred: \`\`\`${err}\`\`\``);
		}
	};

/**
 * Runs the bot using the provided `config`.
 */
export const run = async (config: IConfig): Promise<void> => {
	const client = await login(config.botToken);

	// Shut down the bot on program exit.
	process.on("beforeExit", () => client.destroy());

	client.on("messageCreate", handleMessage(config, client));

	console.log(`✅ Logged in as ${client.user?.username}`);
};
