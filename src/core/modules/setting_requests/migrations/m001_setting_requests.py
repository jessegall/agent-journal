from engine.database.migration import Migration


class SettingRequestsTableMigration(Migration):
    """Creates the table of settings an agent asked a person to change."""

    number = 1
    statements = (
        "CREATE TABLE setting_requests (id INTEGER PRIMARY KEY, environment_id INTEGER NOT NULL REFERENCES environments(id) ON DELETE RESTRICT,"
        " creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,"
        " key TEXT NOT NULL, value TEXT NOT NULL, project INTEGER NOT NULL DEFAULT 0,"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "CREATE INDEX setting_requests_question ON setting_requests (question_id)",
    )
