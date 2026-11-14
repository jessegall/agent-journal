from engine.database.migration import Migration


class MergeRequestsMigration(Migration):
    number = 44
    statements = [
        "CREATE TABLE merge_requests (id INTEGER PRIMARY KEY, environment_id INTEGER NOT NULL REFERENCES environments(id),"
        " worktree_id INTEGER NOT NULL REFERENCES worker_worktrees(id), worker_id INTEGER NOT NULL REFERENCES agents(id),"
        " creator_id INTEGER NOT NULL REFERENCES actors(id), target_branch TEXT NOT NULL, target_commit TEXT NOT NULL,"
        " branch TEXT NOT NULL, branch_commit TEXT NOT NULL, folder TEXT NOT NULL,"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
    ]
