from core.base.database.migration import Migration


class MergerLinesMigration(Migration):
    """Creates merger lines and marks workers returned to the main agent."""

    number = 30
    statements = (
        "CREATE TABLE merger_lines (id INTEGER PRIMARY KEY, environment_id INTEGER NOT NULL REFERENCES environments(id) ON DELETE RESTRICT,"
        " text TEXT NOT NULL, fallback_source TEXT NOT NULL, read_at TEXT, version INTEGER NOT NULL DEFAULT 1,"
        " metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "CREATE INDEX merger_lines_unread ON merger_lines (environment_id, read_at)",
        "ALTER TABLE worker_worktrees ADD COLUMN left_to_main_at TEXT",
    )
