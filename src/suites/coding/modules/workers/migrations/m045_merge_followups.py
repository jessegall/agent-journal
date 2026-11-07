from core.base.database.migration import Migration


class MergeFollowupsMigration(Migration):
    number = 45
    statements = [
        "CREATE TABLE merge_followups (id INTEGER PRIMARY KEY, environment_id INTEGER NOT NULL REFERENCES environments(id),"
        " worktree_id INTEGER NOT NULL REFERENCES worker_worktrees(id), worker_id INTEGER NOT NULL REFERENCES agents(id),"
        " creator_id INTEGER NOT NULL REFERENCES actors(id), folder TEXT NOT NULL, target_branch TEXT NOT NULL,"
        " commit_before TEXT NOT NULL, commit_after TEXT NOT NULL, revision TEXT NOT NULL,"
        " commands TEXT NOT NULL CHECK (json_valid(commands)), results TEXT NOT NULL CHECK (json_valid(results)),"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "CREATE INDEX merge_followups_environment ON merge_followups (environment_id, worktree_id)",
    ]
