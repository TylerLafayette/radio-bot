import { Collection } from "discord.js";

/**
 * Utility function for throwing an error.
 */
export const throwErr = (err: string) => {
	throw new Error(err);
};

/**
 * Returns a function that calls the supplied function `f`, returning
 * its value on success. On error, it returns `def` instead.
 */
export const withDefault =
	<A, T>(f: (arg0: A) => T, def: T): ((arg0: A) => T) =>
	(...args) => {
		try {
			return f(...args);
		} catch (e) {
			return def;
		}
	};

/**
 * Converts a collection to an array of tuples because I hate dealing with Collections.
 */
export const collectionToArray = <K, V>(
	collection: Collection<K, V>
): [K, V][] => {
	let array: [K, V][] = [];
	for (let key of collection.keys())
		array = [...array, [key as K, collection.get(key) as V]];

	return array;
};
