from core.base.database.migration import Migration


class OverviewReadsMigration(Migration):
    """Keeps the overviews an agent read, by command and target."""

    number = 45
    statements = [
        "CREATE TABLE overview_reads (id INTEGER PRIMARY KEY, session_agent_id INTEGER NOT NULL REFERENCES agents(id) ON DELETE CASCADE,"
        " creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, command_name TEXT NOT NULL, target TEXT NOT NULL,"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "CREATE INDEX overview_reads_read ON overview_reads (session_agent_id, command_name, target)",
    ]
