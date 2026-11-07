from core.base.database.rebuild_migration import RebuildMigration

ROW_COLUMNS = "version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL"
SHARED_COLUMNS = "id, plugin_id, environment_id, session_agent_id, creator_id"
TAIL_COLUMNS = "version, metadata, created_at, updated_at"


class PluginEventDeliveriesMigration(RebuildMigration):
    """A system event has no agent and no environment, so a delivery and an output may have neither; a delivery names
    the script it runs and the log row it came from."""

    number = 5
    statements = (
        "CREATE TABLE plugin_deliveries_new (id INTEGER PRIMARY KEY, plugin_id INTEGER NOT NULL REFERENCES plugins(id) ON DELETE CASCADE,"
        " environment_id INTEGER REFERENCES environments(id) ON DELETE CASCADE, session_agent_id INTEGER REFERENCES agents(id) ON DELETE CASCADE,"
        " creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT,"
        f" event TEXT NOT NULL, data TEXT NOT NULL CHECK (json_valid(data)), script TEXT NOT NULL DEFAULT '', event_id INTEGER, {ROW_COLUMNS}) STRICT",
        f"INSERT INTO plugin_deliveries_new ({SHARED_COLUMNS}, event, data, {TAIL_COLUMNS}) SELECT {SHARED_COLUMNS}, event, data, {TAIL_COLUMNS} FROM plugin_deliveries",
        "DROP TABLE plugin_deliveries",
        "ALTER TABLE plugin_deliveries_new RENAME TO plugin_deliveries",
        "CREATE TABLE plugin_outputs_new (id INTEGER PRIMARY KEY, plugin_id INTEGER NOT NULL REFERENCES plugins(id) ON DELETE CASCADE,"
        " environment_id INTEGER REFERENCES environments(id) ON DELETE CASCADE, session_agent_id INTEGER REFERENCES agents(id) ON DELETE CASCADE,"
        " creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT,"
        f" output TEXT NOT NULL CHECK (json_valid(output)), {ROW_COLUMNS}) STRICT",
        f"INSERT INTO plugin_outputs_new ({SHARED_COLUMNS}, output, {TAIL_COLUMNS}) SELECT {SHARED_COLUMNS}, output, {TAIL_COLUMNS} FROM plugin_outputs",
        "DROP TABLE plugin_outputs",
        "ALTER TABLE plugin_outputs_new RENAME TO plugin_outputs",
        "CREATE INDEX plugin_outputs_plugin ON plugin_outputs (plugin_id)",
    )
