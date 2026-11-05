from core.base.database.migration import Migration

ROW_COLUMNS = "version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL"


class SequencesTablesMigration(Migration):
    """Creates the sequences and sequence runs tables."""

    number = 1
    statements = (
        "CREATE TABLE sequences (id INTEGER PRIMARY KEY, creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT,"
        f" title TEXT NOT NULL CHECK (length(title) BETWEEN 1 AND 200), steps TEXT NOT NULL CHECK (json_valid(steps)), {ROW_COLUMNS}) STRICT",
        "CREATE TABLE sequence_runs (id INTEGER PRIMARY KEY, environment_id INTEGER NOT NULL REFERENCES environments(id) ON DELETE RESTRICT,"
        " agent_id INTEGER NOT NULL REFERENCES agents(id) ON DELETE CASCADE, sequence_id INTEGER NOT NULL REFERENCES sequences(id) ON DELETE CASCADE,"
        f" step_number INTEGER NOT NULL DEFAULT 1, step_started INTEGER NOT NULL DEFAULT 0, ended_at TEXT, outcome TEXT NOT NULL DEFAULT '', {ROW_COLUMNS}) STRICT",
        "CREATE INDEX sequence_runs_agent ON sequence_runs (agent_id, ended_at)",
    )
