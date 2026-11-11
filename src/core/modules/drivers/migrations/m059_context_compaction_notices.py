from engine.database.migration import Migration


class ContextCompactionNoticesMigration(Migration):
    """Gives each compaction whether its request repeats one that never started and the cause it failed
    with, and creates the table of what a person was told about a compaction, one row for each notice of
    each compaction."""

    number = 59
    statements = [
        "ALTER TABLE context_compactions ADD COLUMN is_retry INTEGER NOT NULL DEFAULT 0",
        "ALTER TABLE context_compactions ADD COLUMN failure TEXT NOT NULL DEFAULT ''",
        "CREATE TABLE context_compaction_notices (id INTEGER PRIMARY KEY, compaction_id INTEGER NOT NULL REFERENCES context_compactions(id) ON DELETE CASCADE,"
        " session_agent_id INTEGER NOT NULL REFERENCES agents(id) ON DELETE CASCADE, agent_number INTEGER NOT NULL, notice TEXT NOT NULL, cause TEXT NOT NULL DEFAULT '',"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "CREATE UNIQUE INDEX context_compaction_notices_once ON context_compaction_notices (compaction_id, notice)",
    ]
