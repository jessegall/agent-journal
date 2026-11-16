from engine.database.rebuild_migration import RebuildMigration

KEPT_COLUMNS = ("environment_id, parent_id, creator_id, session, program, role, pid, process_started_at, ended_at, version, metadata, created_at,"
                " updated_at, launch_agent_id, paused_at, program_model, profile, given_name, access, launch_name, retired_at, retirement_reason,"
                " retiring_actor_id, usage_limit_ends_at, interrupted_at, launched_at, halted_at, number, launch_failed_at, announced_at")


class AgentOwnIdsMigration(RebuildMigration):
    """Rebuilds the agents table so an agent has an id of its own and names its actor in actor_id, required and
    unique; every agent so far keeps its id, which is also its actor's."""

    number = 30
    statements = (
        "CREATE TABLE agents_rebuilt (id INTEGER PRIMARY KEY, actor_id INTEGER NOT NULL UNIQUE REFERENCES actors(id) ON DELETE RESTRICT,"
        " environment_id INTEGER NOT NULL REFERENCES environments(id) ON DELETE RESTRICT, parent_id INTEGER REFERENCES agents(id) ON DELETE RESTRICT,"
        " creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, session TEXT NOT NULL UNIQUE, program TEXT NOT NULL, role TEXT NOT NULL,"
        " pid INTEGER, process_started_at TEXT, ended_at TEXT, version INTEGER NOT NULL DEFAULT 1,"
        " metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL, launch_agent_id INTEGER,"
        " paused_at TEXT, program_model TEXT NOT NULL DEFAULT '', profile TEXT NOT NULL DEFAULT '', given_name TEXT NOT NULL DEFAULT '',"
        " access TEXT NOT NULL DEFAULT 'writing', launch_name TEXT, retired_at TEXT, retirement_reason TEXT NOT NULL DEFAULT '', retiring_actor_id INTEGER,"
        " usage_limit_ends_at TEXT, interrupted_at TEXT, launched_at TEXT, halted_at TEXT, number INTEGER, launch_failed_at TEXT, announced_at TEXT) STRICT",
        f"INSERT INTO agents_rebuilt (id, actor_id, {KEPT_COLUMNS}) SELECT id, id, {KEPT_COLUMNS} FROM agents",
        "DROP TABLE agents",
        "ALTER TABLE agents_rebuilt RENAME TO agents",
        "CREATE INDEX agents_environment ON agents (environment_id, ended_at)",
        "CREATE INDEX agents_pid ON agents (pid, ended_at)",
        "CREATE INDEX agents_role ON agents (role)",
        "CREATE INDEX agents_parent ON agents (parent_id)",
        "CREATE INDEX agents_open ON agents (id) WHERE ended_at IS NULL",
        "CREATE INDEX agents_launch_name ON agents (launch_name)",
        "CREATE INDEX agents_kept_profile ON agents (environment_id, role, profile) WHERE retired_at IS NULL",
        "CREATE UNIQUE INDEX agents_environment_number ON agents (environment_id, number)",
        "CREATE UNIQUE INDEX agents_one_main ON agents (environment_id) WHERE role = 'main'",
    )
