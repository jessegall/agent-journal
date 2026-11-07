from core.base.database.migration import Migration


class TaskTagsMigration(Migration):
    """Adds task tags with one copy of each word per task."""

    number = 20
    statements = [
        "CREATE TABLE task_tags (id INTEGER PRIMARY KEY, task_id INTEGER NOT NULL REFERENCES tasks(id),"
        " creator_id INTEGER NOT NULL REFERENCES actors(id), word TEXT NOT NULL,"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL, UNIQUE (task_id, word)) STRICT",
        "CREATE INDEX task_tags_word ON task_tags (word, task_id)",
    ]
