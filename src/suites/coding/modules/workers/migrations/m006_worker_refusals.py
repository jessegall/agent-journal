from core.base.database.migration import Migration


class WorkerRefusalsMigration(Migration):
    number = 6
    statements = ["CREATE TABLE worker_refusal_counts (id INTEGER PRIMARY KEY,"
                  " worktree_id INTEGER NOT NULL UNIQUE REFERENCES worker_worktrees(id) ON DELETE CASCADE,"
                  " creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT,"
                  " count INTEGER NOT NULL DEFAULT 0, notice_at TEXT, version INTEGER NOT NULL DEFAULT 1,"
                  " metadata TEXT NOT NULL DEFAULT '{}', created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT"]
