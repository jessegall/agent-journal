from engine.database.migration import Migration


class WorktreeBehindChecksMigration(Migration):
    """Creates the looks at worktrees that fell behind their base branch, and the time of the last look of each
    environment, so a restart does not look at every worktree again at once."""

    number = 78
    statements = (
        "CREATE TABLE worktree_behind_checks (id INTEGER PRIMARY KEY, environment_id INTEGER NOT NULL REFERENCES environments(id),"
        " worktree_id INTEGER NOT NULL REFERENCES worker_worktrees(id) ON DELETE CASCADE, base_tip TEXT NOT NULL, behind INTEGER NOT NULL,"
        " state TEXT NOT NULL, decided_by INTEGER REFERENCES actors(id), reason TEXT NOT NULL DEFAULT '', reminders INTEGER NOT NULL DEFAULT 0,"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "CREATE INDEX worktree_behind_checks_worktree ON worktree_behind_checks (worktree_id, state)",
        "CREATE INDEX worktree_behind_checks_environment ON worktree_behind_checks (environment_id, id)",
        "CREATE TABLE worktree_behind_looks (id INTEGER PRIMARY KEY, environment_id INTEGER NOT NULL UNIQUE REFERENCES environments(id), looked_at TEXT NOT NULL,"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
    )
