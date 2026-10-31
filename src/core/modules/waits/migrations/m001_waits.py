from core.base.database.migration import Migration

COMMON = " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT"


class WaitsTablesMigration(Migration):
    """Creates the waits and the rows each wait on rows ends on."""

    number = 1
    statements = (
        "CREATE TABLE waits (id INTEGER PRIMARY KEY, agent_id INTEGER NOT NULL REFERENCES agents(id) ON DELETE RESTRICT,"
        " creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, type TEXT NOT NULL, focus TEXT NOT NULL, state TEXT NOT NULL DEFAULT 'open',"
        " outcome TEXT NOT NULL DEFAULT '', opened_at TEXT NOT NULL, ended_at TEXT," + COMMON,
        "CREATE INDEX waits_agent ON waits (agent_id, state)",
        "CREATE TABLE wait_targets (id INTEGER PRIMARY KEY, wait_id INTEGER NOT NULL REFERENCES waits(id) ON DELETE CASCADE,"
        " creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, row_table TEXT NOT NULL, row_id INTEGER NOT NULL, resolved_at TEXT," + COMMON,
        "CREATE INDEX wait_targets_row ON wait_targets (row_table, row_id, resolved_at)",
    )
