from core.base.database.migration import Migration


class TasksTablesMigration(Migration):
    """Creates the tasks table with its log lines and its dependencies."""

    number = 1
    statements = (
        "CREATE TABLE tasks (id INTEGER PRIMARY KEY, environment_id INTEGER NOT NULL REFERENCES environments(id) ON DELETE RESTRICT,"
        " holder_id INTEGER REFERENCES agents(id) ON DELETE RESTRICT, creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT,"
        " title TEXT NOT NULL CHECK (length(title) BETWEEN 1 AND 80), brief TEXT NOT NULL DEFAULT '', state TEXT NOT NULL DEFAULT 'open',"
        " priority TEXT NOT NULL DEFAULT 'normal', reason TEXT NOT NULL DEFAULT '', outcome TEXT NOT NULL DEFAULT '', closed_at TEXT,"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "CREATE INDEX tasks_open ON tasks (environment_id, state) WHERE closed_at IS NULL",
        "CREATE INDEX tasks_holder ON tasks (holder_id) WHERE holder_id IS NOT NULL",
        "CREATE TABLE task_logs (id INTEGER PRIMARY KEY, task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,"
        " creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, line TEXT NOT NULL, version INTEGER NOT NULL DEFAULT 1,"
        " metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "CREATE INDEX task_logs_task ON task_logs (task_id, id)",
        "CREATE TABLE task_dependencies (id INTEGER PRIMARY KEY, task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE RESTRICT,"
        " dependency_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE RESTRICT, creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT,"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL, UNIQUE (task_id, dependency_id), CHECK (task_id != dependency_id)) STRICT",
        "CREATE INDEX task_dependencies_reverse ON task_dependencies (dependency_id)",
    )
