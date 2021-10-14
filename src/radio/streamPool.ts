import {
	IStateManager,
	newStateManager,
	transformStateAsync,
} from "./stateManager";
import { TStreamManager } from "./stream";

type TStreamMap = {
	[key: string]: TStreamManager;
};

export type TStreamPool = IStateManager<TStreamMap>;

/**
 * Creates and returns a new `TStreamPool`.
 */
export const newStreamPool = (): TStreamPool => newStateManager({});

/**
 * Gets a stream by `serverId` and returns `null` if nothing is found.
 */
export const getStream =
	(serverId: string) =>
	async (pool: TStreamPool): Promise<TStreamManager | null> =>
		(await pool.getState())[serverId] || null;

/**
 * Puts a stream into the pool by `serverId`.
 */
const _putStream =
	(serverId: string, sm: TStreamManager) =>
	async (map: TStreamMap): Promise<TStreamMap> => ({
		...map,
		[serverId]: sm,
	});
/**
 * Puts a stream into the pool by `serverId`.
 */
export const putStream = (serverId: string, sm: TStreamManager) =>
	transformStateAsync(_putStream(serverId, sm));
