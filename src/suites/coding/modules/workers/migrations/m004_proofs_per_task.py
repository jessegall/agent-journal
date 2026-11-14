from engine.database.migration import Migration


class ProofsPerTaskMigration(Migration):
    """A worktree may hold several tasks, so a proof belongs to a point of one task, not only of the worktree."""

    number = 4
    statements = (
        "DROP VIEW IF EXISTS worker_points",
        "CREATE TABLE proofs_new (id INTEGER PRIMARY KEY, task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE RESTRICT,"
        " worktree_id INTEGER NOT NULL REFERENCES worker_worktrees(id) ON DELETE RESTRICT, creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT,"
        " point INTEGER NOT NULL CHECK (point >= 1), text TEXT NOT NULL, shortfall TEXT NOT NULL DEFAULT '', state TEXT NOT NULL DEFAULT 'shown',"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL, UNIQUE (worktree_id, task_id, point)) STRICT",
        "INSERT INTO proofs_new SELECT id, task_id, worktree_id, creator_id, point, text, shortfall, state, version, metadata, created_at, updated_at FROM proofs",
        "DROP TABLE proofs",
        "ALTER TABLE proofs_new RENAME TO proofs",
        "CREATE INDEX proofs_task ON proofs (task_id, point)",
        "CREATE INDEX proofs_worktree ON proofs (worktree_id, point)",
    )
