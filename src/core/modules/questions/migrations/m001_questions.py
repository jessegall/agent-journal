from core.base.database.migration import Migration


class QuestionsTablesMigration(Migration):
    """Creates the questions table."""

    number = 1
    statements = (
        "CREATE TABLE questions (id INTEGER PRIMARY KEY, environment_id INTEGER NOT NULL REFERENCES environments(id) ON DELETE RESTRICT,"
        " agent_id INTEGER NOT NULL REFERENCES agents(id) ON DELETE RESTRICT, creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT,"
        " text TEXT NOT NULL CHECK (length(text) BETWEEN 1 AND 500), options TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(options)),"
        " recommended TEXT NOT NULL DEFAULT '', answer TEXT NOT NULL DEFAULT '', state TEXT NOT NULL DEFAULT 'open',"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "CREATE INDEX questions_environment ON questions (environment_id, state)",
    )
