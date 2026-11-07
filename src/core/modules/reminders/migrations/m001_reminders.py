from core.base.database.migration import Migration


class RemindersTableMigration(Migration):
    """Creates the reminders table and moves in the memories that had a due time."""

    number = 1
    statements = (
        "CREATE TABLE reminders (id INTEGER PRIMARY KEY, environment_id INTEGER NOT NULL REFERENCES environments(id) ON DELETE CASCADE,"
        " creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, text TEXT NOT NULL CHECK (length(text) >= 1), interval_seconds INTEGER NOT NULL DEFAULT 0,"
        " interval_tool_uses INTEGER NOT NULL DEFAULT 0, interval_tasks INTEGER NOT NULL DEFAULT 0, due_at TEXT, single_use INTEGER NOT NULL DEFAULT 0, block_condition TEXT NOT NULL DEFAULT '',"
        " block_subject TEXT NOT NULL DEFAULT '', last_fired_at TEXT, ended_at TEXT, version INTEGER NOT NULL DEFAULT 1,"
        " metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "INSERT INTO reminders (environment_id, creator_id, text, due_at, single_use, created_at, updated_at) SELECT environment_id, creator_id, text, due_at, 1, created_at, updated_at"
        " FROM memories WHERE due_at IS NOT NULL AND removed_at IS NULL AND environment_id IS NOT NULL",
        "UPDATE memories SET state = 'removed', removed_at = updated_at WHERE due_at IS NOT NULL AND removed_at IS NULL AND environment_id IS NOT NULL",
    )
