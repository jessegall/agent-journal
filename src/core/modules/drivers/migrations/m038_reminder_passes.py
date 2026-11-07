from core.base.database.migration import Migration


class ReminderPassesMigration(Migration):
    """Keeps how often an agent let a repeating reminder pass for each thing it names, and lets a block be skipped with a reason."""

    number = 38
    statements = [
        "ALTER TABLE agent_blocks ADD COLUMN is_skippable INTEGER NOT NULL DEFAULT 0",
        "CREATE TABLE reminder_passes (id INTEGER PRIMARY KEY, session_agent_id INTEGER NOT NULL REFERENCES agents(id) ON DELETE CASCADE,"
        " creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, key TEXT NOT NULL, counts TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(counts)),"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "CREATE UNIQUE INDEX reminder_passes_reminder ON reminder_passes (session_agent_id, key)",
    ]
