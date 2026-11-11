from engine.database.migration import Migration


class WorktreeReachesMigration(Migration):
    """Creates the links between a worker run of a checkpoint and the worktree and commit it tests."""

    number = 73
    statements = (
        "CREATE TABLE worktree_reaches (id INTEGER PRIMARY KEY, reach_id INTEGER NOT NULL REFERENCES checkpoint_reaches(id) ON DELETE CASCADE,"
        " worktree_id INTEGER NOT NULL REFERENCES worker_worktrees(id) ON DELETE CASCADE, phase_id INTEGER NOT NULL, commit_id TEXT NOT NULL,"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "CREATE INDEX worktree_reaches_worktree ON worktree_reaches (worktree_id, phase_id)",
        "CREATE INDEX worktree_reaches_reach ON worktree_reaches (reach_id)",
    )
