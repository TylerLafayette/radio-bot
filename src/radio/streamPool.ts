import { getFromPool, newPool, putInPool, TPool } from "./pool";
import {
	IStateManager,
	newStateManager,
	transformStateAsync,
} from "./stateManager";
import { TStreamManager } from "./stream";

export type TStreamPool = TPool<string, TStreamManager>;

/**
 * Creates and returns a new `TStreamPool`.
 */
export const newStreamPool: () => TStreamPool = newPool;

/**
 * Gets a stream by `serverId` and returns `null` if nothing is found.
 */
export const getStream: (
	key: string
) => (pool: TStreamPool) => Promise<TStreamManager> = getFromPool;

/**
 * Puts a stream into the pool by `serverId`.
 */
export const putStream = putInPool;
