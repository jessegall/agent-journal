from core.base.database.migration import Migration

ROW_COLUMNS = "version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL"


class PluginsTablesMigration(Migration):
    """Creates the plugins, plugin settings and plugin deliveries tables."""

    number = 1
    statements = (
        "CREATE TABLE plugins (id INTEGER PRIMARY KEY, creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, name TEXT NOT NULL UNIQUE,"
        " title TEXT NOT NULL, source TEXT NOT NULL, release TEXT NOT NULL, enabled INTEGER NOT NULL DEFAULT 1, files_digest TEXT NOT NULL DEFAULT '',"
        f" last_fault TEXT NOT NULL DEFAULT '', fault_count INTEGER NOT NULL DEFAULT 0, failing INTEGER NOT NULL DEFAULT 0, {ROW_COLUMNS}) STRICT",
        "CREATE TABLE plugin_settings (id INTEGER PRIMARY KEY, plugin_id INTEGER NOT NULL REFERENCES plugins(id) ON DELETE CASCADE,"
        " creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, key TEXT NOT NULL, value TEXT NOT NULL CHECK (json_valid(value)),"
        f" {ROW_COLUMNS}, UNIQUE (plugin_id, key)) STRICT",
        "CREATE TABLE plugin_deliveries (id INTEGER PRIMARY KEY, plugin_id INTEGER NOT NULL REFERENCES plugins(id) ON DELETE CASCADE,"
        " environment_id INTEGER NOT NULL REFERENCES environments(id) ON DELETE CASCADE, creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT,"
        f" event TEXT NOT NULL, data TEXT NOT NULL CHECK (json_valid(data)), {ROW_COLUMNS}) STRICT",
    )
