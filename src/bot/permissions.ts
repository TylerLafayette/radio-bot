import { throwErr } from "../util";

export enum EPermissionLevel {
	None = 0,
	User = 1,
	Moderator = 2,
	Admin = 3,
	Owner = 4,
}

export enum EPermission {
	BasicCommands = 1,
	ModifyAudioSettings = 2,
	ModifyServerConfiguration = 3,
}

/**
 * Calculates whether or not `level` has the specified `permission`.
 */
const levelHasPermission =
	(permission: EPermission) => (level: EPermissionLevel) =>
		level >= permission;

/**
 * Checks if a `level` has the specified `permission` and throws an error if
 * the `level` does not have the `permission`.
 */
export const requirePermission =
	(permission: EPermission) => (level: EPermissionLevel) =>
		levelHasPermission(permission)(level) ||
		throwErr("you do not have permission to use this command");
