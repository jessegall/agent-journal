from core.base.database.migration import Migration


class WorktreeMergeCommitsMigration(Migration):
    number = 20
    statements = ["ALTER TABLE worker_worktrees ADD COLUMN commit_before_merge TEXT NOT NULL DEFAULT ''",
                  "ALTER TABLE worker_worktrees ADD COLUMN commit_after_merge TEXT NOT NULL DEFAULT ''",
                  "ALTER TABLE worker_worktrees ADD COLUMN merged_task_ids TEXT NOT NULL DEFAULT ''"]
