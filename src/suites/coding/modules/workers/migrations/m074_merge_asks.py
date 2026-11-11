from engine.database.migration import Migration


class MergeAsksMigration(Migration):
    """Creates the asks of workers for the merge of their committed work."""

    number = 74
    statements = (
        "CREATE TABLE worker_merge_asks (id INTEGER PRIMARY KEY, environment_id INTEGER NOT NULL REFERENCES environments(id),"
        " creator_id INTEGER NOT NULL REFERENCES actors(id), worktree_id INTEGER NOT NULL REFERENCES worker_worktrees(id) ON DELETE CASCADE,"
        " commit_id TEXT NOT NULL, task_ids TEXT NOT NULL, unit_name TEXT NOT NULL, note TEXT NOT NULL, is_whole INTEGER NOT NULL, state TEXT NOT NULL,"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "CREATE INDEX worker_merge_asks_worktree ON worker_merge_asks (worktree_id, state)",
    )
