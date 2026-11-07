from core.base.database.migration import Migration


class SecretSettingsTableMigration(Migration):
    """Creates the table of secret settings, kept apart so the event log never holds their values."""

    number = 2
    statements = (
        "CREATE TABLE secret_settings (id INTEGER PRIMARY KEY, environment_id INTEGER REFERENCES environments(id) ON DELETE RESTRICT,"
        " creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, key TEXT NOT NULL, value TEXT NOT NULL,"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL, UNIQUE (environment_id, key)) STRICT",
        "CREATE UNIQUE INDEX secret_settings_project ON secret_settings (key) WHERE environment_id IS NULL",
    )
