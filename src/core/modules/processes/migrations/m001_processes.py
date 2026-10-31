from core.base.database.migration import Migration

COMMON = " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL"


class ProcessesTablesMigration(Migration):
    """Creates the processes table with the parts of each line, their outputs and the watches on them."""

    number = 1
    statements = (
        "CREATE TABLE processes (id INTEGER PRIMARY KEY, environment_id INTEGER NOT NULL REFERENCES environments(id) ON DELETE RESTRICT,"
        " agent_id INTEGER NOT NULL REFERENCES agents(id) ON DELETE RESTRICT, hook_call_id INTEGER REFERENCES hook_calls(id) ON DELETE SET NULL,"
        " creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, line TEXT NOT NULL, folder TEXT NOT NULL, shell TEXT NOT NULL,"
        " category TEXT NOT NULL, limit_seconds INTEGER NOT NULL CHECK (limit_seconds >= 0), state TEXT NOT NULL DEFAULT 'running',"
        " exit_code INTEGER, pid INTEGER, progress INTEGER NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100), moved_at TEXT, ended_at TEXT," + COMMON + ") STRICT",
        "CREATE INDEX processes_agent ON processes (agent_id, id)",
        "CREATE INDEX processes_open ON processes (environment_id, state) WHERE ended_at IS NULL",
        "CREATE TABLE process_parts (id INTEGER PRIMARY KEY, process_id INTEGER NOT NULL REFERENCES processes(id) ON DELETE CASCADE,"
        " position INTEGER NOT NULL CHECK (position >= 1), text TEXT NOT NULL, program TEXT NOT NULL, piped INTEGER NOT NULL DEFAULT 0,"
        " state TEXT NOT NULL DEFAULT 'waiting', exit_code INTEGER, started_at TEXT, ended_at TEXT," + COMMON + ", UNIQUE (process_id, position)) STRICT",
        "CREATE TABLE outputs (id INTEGER PRIMARY KEY, process_id INTEGER NOT NULL UNIQUE REFERENCES processes(id) ON DELETE CASCADE,"
        " creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, folder TEXT NOT NULL, byte_count INTEGER NOT NULL DEFAULT 0,"
        " line_count INTEGER NOT NULL DEFAULT 0, state TEXT NOT NULL DEFAULT 'kept', read_at TEXT, pruned_at TEXT," + COMMON + ") STRICT",
        "CREATE INDEX outputs_kept ON outputs (state, created_at)",
        "CREATE TABLE watches (id INTEGER PRIMARY KEY, agent_id INTEGER NOT NULL REFERENCES agents(id) ON DELETE RESTRICT,"
        " process_id INTEGER NOT NULL REFERENCES processes(id) ON DELETE CASCADE, creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT,"
        " seen_lines INTEGER NOT NULL DEFAULT 0, state TEXT NOT NULL DEFAULT 'open'," + COMMON + ") STRICT",
        "CREATE INDEX watches_open ON watches (agent_id) WHERE state = 'open'",
    )
