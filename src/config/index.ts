import { config } from "dotenv";

import { throwErr, withDefault } from "../util";

/**
 * Stores configuration as a key-value pair.
 */
export interface IConfig {
	botToken: string;
	prefix: string;
	dbFilename: string;
}

/**
 * Gets an environment variable as a string.
 */
const getEnv = (key: string): string =>
	process.env[key] || throwErr(`could not find environment variable ${key}`);

const getEnvOrDefault = (key: string, def: string): string =>
	withDefault(getEnv, def)(key);

/**
 * Gets the configuration from environment variables.
 */
export const getConfig = async (): Promise<IConfig> => {
	// Load .env if one exists
	config();

	return {
		botToken: getEnv("RADIO_BOT_TOKEN"),
		prefix: getEnvOrDefault("RADIO_BOT_PREFIX", "//"),
		dbFilename: getEnvOrDefault("RADIO_BOT_DB_FILENAME", "data.sql"),
	};
};
