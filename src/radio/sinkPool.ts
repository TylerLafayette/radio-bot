import { Stream, Readable, Writable } from "stream";
import { getFromPool, newPool, putInPool, TPool } from "./pool";

export type TSinkPool = TPool<string, Readable & Writable>;

/**
 * Creates and returns a new `TSinkPool`.
 */
export const newSinkPool: () => TSinkPool = newPool;

/**
 * Gets a sink by `sinkId` and returns `null` if nothing is found.
 */
export const getSink: (
	key: string
) => (pool: TSinkPool) => Promise<Readable & Writable> = getFromPool;

/**
 * Puts a sink into the pool by `sinkId`.
 */
export const putSink = putInPool;
