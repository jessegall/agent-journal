from core.base.database.migration import Migration


class PlansTables(Migration):
    """Creates the plans table, its phases and the places of tasks in them."""

    number = 1
    statements = (
        "CREATE TABLE plans (id INTEGER PRIMARY KEY, environment_id INTEGER NOT NULL REFERENCES environments(id) ON DELETE RESTRICT,"
        " creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, title TEXT NOT NULL CHECK (length(title) BETWEEN 1 AND 80),"
        " brief TEXT NOT NULL DEFAULT '', state TEXT NOT NULL DEFAULT 'draft', reason TEXT NOT NULL DEFAULT '', closed_at TEXT,"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "CREATE INDEX plans_open ON plans (environment_id, state) WHERE closed_at IS NULL",
        "CREATE TABLE phases (id INTEGER PRIMARY KEY, plan_id INTEGER NOT NULL REFERENCES plans(id) ON DELETE RESTRICT,"
        " creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, position INTEGER NOT NULL CHECK (position >= 1),"
        " title TEXT NOT NULL, goal TEXT NOT NULL DEFAULT '', checkpoint INTEGER NOT NULL DEFAULT 0 CHECK (checkpoint IN (0, 1)),"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL, UNIQUE (plan_id, position)) STRICT",
        "CREATE TABLE phase_tasks (id INTEGER PRIMARY KEY, phase_id INTEGER NOT NULL REFERENCES phases(id) ON DELETE RESTRICT,"
        " task_id INTEGER NOT NULL UNIQUE REFERENCES tasks(id) ON DELETE RESTRICT, creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT,"
        " position INTEGER NOT NULL CHECK (position >= 1), version INTEGER NOT NULL DEFAULT 1,"
        " metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL,"
        " UNIQUE (phase_id, position)) STRICT",
    )
