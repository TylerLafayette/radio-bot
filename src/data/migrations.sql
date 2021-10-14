CREATE TABLE IF NOT EXISTS servers (
	id VARCHAR(500) PRIMARY KEY,
	guild_id VARCHAR(500),
	joined_at INTEGER
);

CREATE TABLE IF NOT EXISTS server_vc_channels (
	id VARCHAR(500) PRIMARY KEY,
	updated_at INTEGER,
	updated_by VARCHAR(500),
	server_id VARCHAR(500),
	guild_id VARCHAR(500),
	channel_id VARCHAR(500),
	FOREIGN KEY(server_id) REFERENCES servers(id)
);

CREATE TABLE IF NOT EXISTS server_permission_roles (
	id VARCHAR(500) PRIMARY KEY,
	updated_at INTEGER,
	updated_by VARCHAR(500),
	server_id VARCHAR(500),
	guild_id VARCHAR(500),
	role_id VARCHAR(500),
	permission_level INTEGER,
	FOREIGN KEY(server_id) REFERENCES servers(id)
);

CREATE TABLE IF NOT EXISTS server_playlists (
	id VARCHAR(500) PRIMARY KEY,
	updated_at INTEGER,
	updated_by VARCHAR(500),
	server_id VARCHAR(500),
	guild_id VARCHAR(500),
	playlist TEXT,
	FOREIGN KEY(server_id) REFERENCES servers(id)
);
