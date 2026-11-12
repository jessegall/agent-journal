from engine.database.rebuild_migration import RebuildMigration

COLUMNS = ("id, environment_id, holder_id, creator_id, title, brief, state, reason, outcome, closed_at, version, metadata, created_at, updated_at,"
           " priority, started_at, complexity, independence_reason, focused_at")


class TaskHolderAnyActorMigration(RebuildMigration):
    """Rebuilds the tasks table so its holder may be any actor, a person as well as an agent: a person that starts
    a task holds it."""

    number = 27
    statements = (
        "CREATE TABLE tasks_rebuilt (id INTEGER PRIMARY KEY, environment_id INTEGER NOT NULL REFERENCES environments(id) ON DELETE RESTRICT,"
        " holder_id INTEGER REFERENCES actors(id) ON DELETE RESTRICT, creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT,"
        " title TEXT NOT NULL CHECK (length(title) BETWEEN 1 AND 80), brief TEXT NOT NULL DEFAULT '', state TEXT NOT NULL DEFAULT 'open',"
        " reason TEXT NOT NULL DEFAULT '', outcome TEXT NOT NULL DEFAULT '', closed_at TEXT,"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL, priority INTEGER NOT NULL DEFAULT 200, started_at TEXT, complexity INTEGER,"
        " independence_reason TEXT NOT NULL DEFAULT '', focused_at TEXT) STRICT",
        f"INSERT INTO tasks_rebuilt ({COLUMNS}) SELECT {COLUMNS} FROM tasks",
        "DROP TABLE tasks",
        "ALTER TABLE tasks_rebuilt RENAME TO tasks",
        "CREATE INDEX tasks_open ON tasks (environment_id, state) WHERE closed_at IS NULL",
        "CREATE INDEX tasks_holder ON tasks (holder_id) WHERE holder_id IS NOT NULL",
        "CREATE INDEX tasks_environment_state ON tasks (environment_id, state, id)",
        "CREATE INDEX tasks_environment_closed ON tasks (environment_id, closed_at) WHERE closed_at IS NOT NULL",
        "CREATE INDEX tasks_environment_state_closed ON tasks (environment_id, state, closed_at, id)",
        "CREATE INDEX tasks_state ON tasks (state, id)",
        "CREATE INDEX tasks_environment_id ON tasks (environment_id, id)",
    )
