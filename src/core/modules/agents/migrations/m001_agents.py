from core.base.database.migration import Migration


class AgentsTable(Migration):
    """Creates the agents table, whose ids are the ids of their actors."""

    number = 1
    statements = (
        "CREATE TABLE agents (id INTEGER PRIMARY KEY REFERENCES actors(id) ON DELETE RESTRICT,"
        " environment_id INTEGER NOT NULL REFERENCES environments(id) ON DELETE RESTRICT,"
        " parent_id INTEGER REFERENCES agents(id) ON DELETE RESTRICT, creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT,"
        " session TEXT NOT NULL UNIQUE, program TEXT NOT NULL, role TEXT NOT NULL, pid INTEGER, process_started_at TEXT, ended_at TEXT, version INTEGER NOT NULL DEFAULT 1,"
        " metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "CREATE INDEX agents_environment ON agents (environment_id, ended_at)",
        "CREATE INDEX agents_pid ON agents (pid, ended_at)",
    )
