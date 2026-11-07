from core.base.database.migration import Migration


class WorktreePassReasonMigration(Migration):
    number = 34
    statements = ["ALTER TABLE worker_worktrees ADD COLUMN pass_reason TEXT NOT NULL DEFAULT ''"]
