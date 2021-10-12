import { v4 as uuid } from "uuid";
import { EPermissionLevel } from "../bot/permissions";

import { IDbConnection } from "./db";
import {
	IServer,
	ServersTable,
	IServerVcChannel,
	ServerVcChannelsTable,
	IServerPermissionRole,
	ServerPermissionRolesTable,
} from "./servers";
import { throwErr } from "../util";

/**
 * Inserts a new IServer into the database, returning the ID on success.
 */
export const insertServer =
	({ conn }: IDbConnection) =>
	async ({
		guildId,
		joinedAt = new Date(),
	}: {
		guildId: string;
		joinedAt?: Date;
	}): Promise<string> => {
		const id = uuid();
		await conn.run(
			`INSERT INTO ${ServersTable} VALUES (?, ?, ?);`,
			id,
			guildId,
			joinedAt
		);

		return id;
	};

const mapServer = (result: any): IServer => ({
	id: result.id,
	guildId: result.guild_id,
	joinedAt: result.joined_at,
});

/**
 * Fetches a single IServer from the database by ID.
 */
export const getServerById =
	({ conn }: IDbConnection) =>
	async (id: string): Promise<IServer> =>
		mapServer(
			(await conn.get(`SELECT * FROM ${ServersTable} WHERE id = ?`, id)) ||
				throwErr("could not find IServer")
		);

/**
 * Fetches a single IServer from the database by Discord guild ID.
 */
export const getServerByGuildId =
	({ conn }: IDbConnection) =>
	async (id: string): Promise<IServer> =>
		mapServer(
			(await conn.get(
				`SELECT * FROM ${ServersTable} WHERE guild_id = ?`,
				id
			)) || throwErr("could not find IServer")
		);

const mapServerVcChannel = (result: any): IServerVcChannel => ({
	id: result.id,
	updatedAt: result.updated_at,
	updatedBy: result.updated_by,
	serverId: result.server_id,
	guildId: result.guild_id,
	channelId: result.channel_id,
});

/**
 * Inserts a new IServerVcChannel into the database, returning the ID on success.
 */
export const insertServerVcChannel =
	({ conn }: IDbConnection) =>
	async ({
		updatedAt = new Date(),
		updatedBy,
		serverId,
		guildId,
		channelId,
	}: {
		updatedAt?: Date;
		updatedBy: string;
		serverId: string;
		guildId: string;
		channelId: string;
	}): Promise<string> => {
		const id = uuid();
		await conn.run(
			`INSERT INTO ${ServerVcChannelsTable} VALUES (?, ?, ?, ?, ?, ?)`,
			id,
			updatedAt,
			updatedBy,
			serverId,
			guildId,
			channelId
		);

		return id;
	};

/**
 * Updates an IServerVcChannel in the database.
 */
export const updateServerVcChannel =
	({ conn }: IDbConnection) =>
	async ({
		id,
		updatedAt = new Date(),
		updatedBy,
		serverId,
		guildId,
		channelId,
	}: {
		id: string;
		updatedAt?: Date;
		updatedBy: string;
		serverId: string;
		guildId: string;
		channelId: string;
	}): Promise<void> => {
		await conn.run(
			`UPDATE ${ServerVcChannelsTable} SET updated_at = ?, updated_by = ?, server_id = ?, guild_id = ?, channel_id = ? WHERE id= ?`,
			updatedAt,
			updatedBy,
			serverId,
			guildId,
			channelId,
			id
		);
	};

/**
 * Fetches a single IServerVcChannel from the database by ID.
 */
export const getServerVcChannelById =
	({ conn }: IDbConnection) =>
	async (id: string): Promise<IServerVcChannel> =>
		mapServerVcChannel(
			(await conn.get(
				`SELECT * FROM ${ServerVcChannelsTable} WHERE id = ?`,
				id
			)) || throwErr("could not find IServerVcChannel")
		);

/**
 * Fetches a single IServerVcChannel from the database by Discord guild ID.
 */
export const getServerVcChannelByGuildId =
	({ conn }: IDbConnection) =>
	async (id: string): Promise<IServerVcChannel> =>
		mapServerVcChannel(
			(await conn.get(
				`SELECT * FROM ${ServerVcChannelsTable} WHERE guild_id = ?`,
				id
			)) || throwErr("could not find IServerVcChannel")
		);

const mapServerPermissionRole = (result: any): IServerPermissionRole => ({
	id: result.id,
	updatedAt: result.updated_at,
	updatedBy: result.updated_by,
	serverId: result.server_id,
	guildId: result.guild_id,
	roleId: result.role_id,
	permissionLevel: result.permission_level,
});

/**
 * Inserts a new IServerPermissionRole into the database, returning the ID on success.
 */
export const insertServerPermissionRole =
	({ conn }: IDbConnection) =>
	async ({
		updatedAt = new Date(),
		updatedBy,
		serverId,
		guildId,
		roleId,
		permissionLevel,
	}: {
		updatedAt?: Date;
		updatedBy: string;
		serverId: string;
		guildId: string;
		roleId: string;
		permissionLevel: EPermissionLevel;
	}): Promise<string> => {
		const id = uuid();
		await conn.run(
			`INSERT INTO ${ServerPermissionRolesTable} VALUES (?, ?, ?, ?, ?, ?, ?)`,
			id,
			updatedAt,
			updatedBy,
			serverId,
			guildId,
			roleId,
			permissionLevel
		);

		return id;
	};

/**
 * Updates an IServerPermissionRole in the database.
 */
export const updateServerPermissionRole =
	({ conn }: IDbConnection) =>
	async ({
		id,
		updatedAt = new Date(),
		updatedBy,
		serverId,
		guildId,
		roleId,
		permissionLevel,
	}: {
		id: string;
		updatedAt?: Date;
		updatedBy: string;
		serverId: string;
		guildId: string;
		roleId: string;
		permissionLevel: EPermissionLevel;
	}): Promise<void> => {
		await conn.run(
			`UPDATE ${ServerPermissionRolesTable} SET updated_at = ?, updated_by = ?, server_id = ?, guild_id = ?, role_id = ?, permission_level = ? WHERE id= ?`,
			updatedAt,
			updatedBy,
			serverId,
			guildId,
			roleId,
			permissionLevel,
			id
		);
	};

/**
 * Fetches a single IServerPermissionRole from the database by ID.
 */
export const getServerPermissionRoleById =
	({ conn }: IDbConnection) =>
	async (id: string): Promise<IServerPermissionRole> =>
		mapServerPermissionRole(
			(await conn.get(
				`SELECT * FROM ${ServerPermissionRolesTable} WHERE id = ?`,
				id
			)) || throwErr("could not find IServerPermissionRole")
		);

/**
 * Fetches a single IServerPermissionRole from the database by Discord guild ID.
 */
export const getServerPermissionRolesByGuildId =
	({ conn }: IDbConnection) =>
	async (id: string): Promise<IServerPermissionRole[]> =>
		(
			(await conn.all(
				`SELECT * FROM ${ServerPermissionRolesTable} WHERE guild_id = ?`,
				id
			)) || throwErr("could not find IServerPermissionRoles")
		).map(mapServerPermissionRole);

/**
 * Fetches a single IServerPermissionRole from the database by Discord guild ID and Discord role ID.
 */
export const getServerPermissionRoleByGuildIdAndRoleId =
	({ conn }: IDbConnection) =>
	async (guildId: string, roleId: string): Promise<IServerPermissionRole> =>
		mapServerPermissionRole(
			(await conn.get(
				`SELECT * FROM ${ServerPermissionRolesTable} WHERE guild_id = ? AND role_id = ?`,
				guildId,
				roleId
			)) || throwErr("could not find IServerPermissionRoles")
		);
