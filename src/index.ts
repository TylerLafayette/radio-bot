import { getConfig } from "./config";
import * as bot from "./bot";
import { createConnection } from "./data";
import { runMigrations } from "./data/db";
import { newStreamManager, setSong, startStreaming, subscribe } from "./radio";
import { PassThrough } from "stream";
import { stdout } from "process";

const run = async (): Promise<void> => {
	const config = await getConfig();
	const db = await createConnection(config.dbFilename);
	await runMigrations(db);
	const streamManager = newStreamManager();
	await setSong("/Users/tyler/Downloads/test_song.mp3")(streamManager);
	await startStreaming(streamManager);

	await bot.run(config, db, streamManager);
};

run();
