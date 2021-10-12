import { getConfig } from "./config";
import * as bot from "./bot";

const run = async (): Promise<void> => {
	const config = await getConfig();

	await bot.run(config);
};

run();
