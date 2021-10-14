import {
	IStateManager,
	newStateManager,
	transformStateAsync,
} from "./stateManager";

/**
 * Stores an indexed pool of objects of type `T`.
 */
export type TPool<K extends string | number | symbol, V> = IStateManager<
	Record<K, V>
>;

/**
 * Creates and returns a new pool.
 */
export const newPool = <K extends string | number | symbol, V>(): TPool<K, V> =>
	newStateManager({} as Record<K, V>);

/**
 * Gets the item with key `key` from the `TPool`.
 */
export const getFromPool =
	<K extends string | number | symbol, V>(key: K) =>
	async (pool: TPool<K, V>): Promise<V | null> =>
		(await pool.getState())[key] || null;

/**
 * Puts the specified item into the `TPool` with key `key`.
 */
const _putInPool =
	<K extends string | number | symbol, V>(key: K, value: V) =>
	async (pool: Record<K, V>): Promise<Record<K, V>> => ({
		...pool,
		[key]: value,
	});

/**
 * Puts the specified item into the `TPool` with key `key`.
 */
export const putInPool = <K extends string | number | symbol, V>(
	key: K,
	value: V
) => transformStateAsync(_putInPool(key, value));
