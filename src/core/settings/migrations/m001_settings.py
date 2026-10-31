from core.base.database.migration import Migration


class SettingsTable(Migration):
    """Creates the settings table; a key is set once per environment and once for the whole project."""

    number = 1
    statements = (
        "CREATE TABLE settings (id INTEGER PRIMARY KEY, environment_id INTEGER REFERENCES environments(id) ON DELETE RESTRICT,"
        " creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, key TEXT NOT NULL, value TEXT NOT NULL CHECK (json_valid(value)),"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL, UNIQUE (environment_id, key)) STRICT",
        "CREATE UNIQUE INDEX settings_project ON settings (key) WHERE environment_id IS NULL",
    )
