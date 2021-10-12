import { Client, Message } from "discord.js";
import { ChannelTypes } from "discord.js/typings/enums";
import { IBot } from ".";
import { IConfig } from "../config";
import { service } from "../data";
import { collectionToArray, throwErr } from "../util";
import { genericMessage } from "./fmt";
import {
	derivePermissionFromMessage as derivePermission,
	EPermission,
	EPermissionLevel,
	requirePermission,
} from "./permissions";

/**
 * TCommand represents a function for processing a single command.
 */
export type TCommand = (
	bot: IBot
) => (msg: Message, args: string[]) => Promise<void>;

export const hello: TCommand =
	(bot: IBot) =>
	async (msg: Message, args: string[]): Promise<void> => {
		msg.reply("goodbye");
	};

export const attachToVoiceChannel: TCommand =
	(bot: IBot) =>
	async (msg: Message, args: string[]): Promise<void> => {
		requirePermission(EPermission.ModifyServerConfiguration)(
			await derivePermission(bot, msg)
		);

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

		if (!msg.guildId) return throwErr(`guild not found`);
		const server = await service.getServerByGuildId(bot.db)(msg.guildId);

		const serverVcChannel = {
			updatedAt: new Date(),
			updatedBy: msg.author.id,
			serverId: server.id,
			guildId: server.guildId,
			channelId: vcId,
		};

		let id = "";

		try {
			const pr = await service.getServerVcChannelByGuildId(bot.db)(
				server.guildId
			);

			id = pr.id;
		} catch (_) {}

		if (!id) await service.insertServerVcChannel(bot.db)(serverVcChannel);
		else
			await service.updateServerVcChannel(bot.db)({
				id,
				...serverVcChannel,
			});

		msg.reply({
			embeds: [
				genericMessage(
					"Voice channel updated!",
					`Successfully set voice channel to ${vcId}`
				),
			],
		});
	};

const setRolePermissionUsage = (bot: IBot) =>
	`usage: ${bot.config.prefix}setRolePermission <role name> <permission level { user | moderator | admin | owner }>`;

const permissionLevelStringToEPermissionLevel = {
	none: EPermissionLevel.None,
	user: EPermissionLevel.User,
	mod: EPermissionLevel.Moderator,
	moderator: EPermissionLevel.Moderator,
	admin: EPermissionLevel.Admin,
	owner: EPermissionLevel.Owner,
};

export const setRolePermission: TCommand =
	(bot: IBot) =>
	async (
		msg: Message,
		[roleName, permissionLevelStr]: string[]
	): Promise<void> => {
		requirePermission(EPermission.ModifyServerConfiguration)(
			await derivePermission(bot, msg)
		);

		if (!roleName || !permissionLevelStr) throwErr(setRolePermissionUsage(bot));

		if (!msg.guild || !msg.guildId) throwErr(`could not get guild`);

		const role = msg.guild?.roles.cache.find(
			(r) => r.name.toLowerCase() == roleName.toLowerCase()
		);
		if (!role) return throwErr(`role ${roleName} not found`);

		const permissionLevel = (permissionLevelStringToEPermissionLevel as any)[
			permissionLevelStr
		];
		if (!permissionLevel) return throwErr(setRolePermissionUsage(bot));

		if (!msg.guildId) return throwErr("issue");
		const server = await service.getServerByGuildId(bot.db)(msg.guildId);

		const permissionRole = {
			updatedAt: new Date(),
			updatedBy: msg.author.id,
			serverId: server.id,
			guildId: server.guildId,
			roleId: role.id,
			permissionLevel,
		};

		let id = "";

		try {
			const pr = await service.getServerPermissionRoleByGuildIdAndRoleId(
				bot.db
			)(server.guildId, role.id);

			id = pr.id;
		} catch (_) {}

		if (!id) await service.insertServerPermissionRole(bot.db)(permissionRole);
		else
			await service.updateServerPermissionRole(bot.db)({
				id,
				...permissionRole,
			});

		msg.reply({
			embeds: [
				genericMessage(
					"Yay!",
					`Successfully added permission to ${role?.name}`
				),
			],
		});
	};
