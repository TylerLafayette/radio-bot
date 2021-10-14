import { EPermissionLevel } from "../bot/permissions";

export const ServersTable = "servers";

/**
 * Represents a single server the bot has joined.
 */
export interface IServer {
	id: string;
	guildId: string;
	joinedAt: Date;
}

export const ServerVcChannelsTable = "server_vc_channels";

/**
 * Represents the VC channel set for a specific server.
 */
export interface IServerVcChannel {
	id: string;
	updatedAt: Date;
	updatedBy: string;
	serverId: string;
	guildId: string;
	channelId: string;
}

export const ServerPermissionRolesTable = "server_permission_roles";

/**
 * Represents a role in a server which is set to be recognized
 * as a certain permission level by the bot.
 */
export interface IServerPermissionRole {
	id: string;
	updatedAt: Date;
	updatedBy: string;
	serverId: string;
	guildId: string;
	roleId: string;
	permissionLevel: EPermissionLevel;
}

export const ServerPlaylistsTable = "server_playlists";

/**
 * Represents a saved playlist for a server.
 */
export interface IServerPlaylist {
	id: string;
	updatedAt: Date;
	updatedBy: string;
	serverId: string;
	guildId: string;
	playlist: string;
}
