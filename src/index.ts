import { getConfig } from "./config";
import * as bot from "./bot";
import { createConnection } from "./data";
import { runMigrations } from "./data/db";

const run = async (): Promise<void> => {
	const config = await getConfig();
	const db = await createConnection(config.dbFilename);
	await runMigrations(db);

	await bot.run(config, db);
};

run();
