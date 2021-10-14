import crypto from "crypto";
import { TextEncoder } from "util";

import { Collection } from "discord.js";
import { createReadStream } from "fs";
import got from "got/dist/source";
import { Readable } from "stream";
import axios from "axios";

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

/**
 * Computes a sha256 hash of the provided `message`.
 */
export const sha256 = async (message: string) =>
	crypto.createHash("sha256").update(message).digest("hex");

/**
 * Returns a stream from either a file or a URL.
 */
export const universalStream = async (path: string): Promise<Readable> => {
	if (!path.includes("http")) throwErr(`local files are not allowed`); // return createReadStream(path);

	return got.stream(path);
};

/**
 * Gets a JSON file by URL.
 */
export const getJson = async (url: string): Promise<any> =>
	(await axios.get(url)).data;
