import driver from "sqlite3";
import { open, Database } from "sqlite";
import fs from "fs";

/**
 * Wraps an SQLite database connection.
 */
export interface IDbConnection {
	conn: Database;
}

/**
 * Creates a new SQLite connection using the given filename.
 */
export const createConnection = async (
	filename: string
): Promise<IDbConnection> => ({
	conn: await open({
		filename,
		driver: driver.Database,
	}),
});

/**
 * Runs migrations on the provided `IDbConnection`.
 */
export const runMigrations = async (db: IDbConnection): Promise<void> => {
	const migrations = fs.readFileSync("src/data/migrations.sql");

	await db.conn.exec(migrations.toString());
};
