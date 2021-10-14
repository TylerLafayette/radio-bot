import { getConfig } from "./config";
import * as bot from "./bot";
import { createConnection } from "./data";
import { runMigrations } from "./data/db";
import {
	newStreamManager,
	setSong,
	startStreaming,
	subscribe,
	loadPlaylist,
	newSinkPool,
} from "./radio";
import { PassThrough } from "stream";
import { stdout } from "process";
import { readFile } from "fs/promises";
import { newStreamPool } from "./radio/streamPool";

const run = async (): Promise<void> => {
	const config = await getConfig();
	const db = await createConnection(config.dbFilename);
	await runMigrations(db);
	const streamPool = newStreamPool();
	const sinkPool = newSinkPool();

	await bot.run(config, db, streamPool, sinkPool);
};

run();
