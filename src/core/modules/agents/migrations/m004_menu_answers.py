from core.base.database.migration import Migration

COMMON = " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT"


class MenuAnswersMigration(Migration):
    """Keeps each menu the launcher answered in an agent's terminal."""

    number = 4
    statements = ["CREATE TABLE menu_answers (id INTEGER PRIMARY KEY, agent_id INTEGER NOT NULL REFERENCES agents(id) ON DELETE CASCADE, creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT,"
                  " question TEXT NOT NULL, answer TEXT NOT NULL," + COMMON]
