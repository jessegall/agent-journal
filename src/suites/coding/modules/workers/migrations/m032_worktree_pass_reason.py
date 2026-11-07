from core.base.database.migration import Migration


class WorktreePassReasonMigration(Migration):
    number = 32
    statements = ["ALTER TABLE worker_worktrees ADD COLUMN left_to_main_reason TEXT NOT NULL DEFAULT ''"]
