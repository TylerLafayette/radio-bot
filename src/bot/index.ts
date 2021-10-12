import { Client, Guild, Intents, Message } from "discord.js";

import { IConfig } from "../config";
import { IDbConnection, service } from "../data";
import * as commands from "./commands";
import { errorEmbed } from "./fmt";

/**
 * Contains all the dependencies of the bot.
 */
export interface IBot {
	config: IConfig;
	client: Client;
	db: IDbConnection;
}

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

/**
 * Checks that the server is registered in the database and inserts it if not.
 */
export const checkServer = (bot: IBot) => async (guild: Guild) => {
	const { db } = bot;

	try {
		await service.getServerByGuildId(bot.db)(guild.id);
	} catch (_) {
		await service.insertServer(bot.db)({
			guildId: guild.id,
			joinedAt: new Date(),
		});
	}
};

export const handleMessage = (bot: IBot) => async (msg: Message) => {
	const { config, client, db } = bot;
	const { content } = msg;

	// If the message doesn't start with the prefix, ignore it.
	if (!content.startsWith(config.prefix)) return;

	// TODO: do this more efficiently
	// Check that the server is registered in the database.
	if (msg.guild) checkServer(bot)(msg.guild);

	// Strip the prefix from the command.
	const withoutPrefix = content.substr(config.prefix.length);

	// Split the message by spaces and use the first
	// word as the command.
	const [command, ...args] = withoutPrefix.split(" ");

	if (!(commands as any)[command]) return;

	// Call the command.
	try {
		await (commands as any)[command](bot)(msg, args);
	} catch (err) {
		msg.reply({ embeds: [errorEmbed(err)] });
	}
};

/**
 * Runs the bot using the provided `config`.
 */
export const run = async (
	config: IConfig,
	db: IDbConnection
): Promise<void> => {
	const client = await login(config.botToken);

	const bot: IBot = { config, client, db };

	// Shut down the bot on program exit.
	process.on("beforeExit", () => client.destroy());

	client.on("messageCreate", handleMessage(bot));
	client.on("guildCreate", checkServer(bot));

	console.log(`✅ Logged in as ${client.user?.username}`);
};
