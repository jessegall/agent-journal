from core.base.database.migration import Migration


class WorkersTablesMigration(Migration):
    """Creates the worker_worktrees table, one row per worktree, and the proofs table, one row per point proved."""

    number = 1
    statements = (
        "CREATE TABLE worker_worktrees (id INTEGER PRIMARY KEY, agent_id INTEGER NOT NULL REFERENCES agents(id) ON DELETE RESTRICT,"
        " environment_id INTEGER NOT NULL REFERENCES environments(id) ON DELETE RESTRICT, task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE RESTRICT,"
        " creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, folder TEXT NOT NULL, branch TEXT NOT NULL UNIQUE, base_branch TEXT NOT NULL,"
        " base_commit TEXT NOT NULL DEFAULT '', state TEXT NOT NULL DEFAULT 'new', cut_at TEXT, merged_at TEXT, removed_at TEXT,"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "CREATE INDEX worker_worktrees_agent ON worker_worktrees (agent_id)",
        "CREATE INDEX worker_worktrees_task ON worker_worktrees (task_id)",
        "CREATE TABLE proofs (id INTEGER PRIMARY KEY, task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE RESTRICT,"
        " worktree_id INTEGER NOT NULL REFERENCES worker_worktrees(id) ON DELETE RESTRICT, creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT,"
        " point INTEGER NOT NULL CHECK (point >= 1), text TEXT NOT NULL, shortfall TEXT NOT NULL DEFAULT '', state TEXT NOT NULL DEFAULT 'shown',"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL, UNIQUE (worktree_id, point)) STRICT",
        "CREATE INDEX proofs_task ON proofs (task_id, point)",
    )
