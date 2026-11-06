from core.base.database.migration import Migration


class WorktreeNewAgentReasonMigration(Migration):
    """Adds the reason a worker started new though a kept worker could take the task."""

    number = 26
    statements = ["ALTER TABLE worker_worktrees ADD COLUMN fresh_reason TEXT NOT NULL DEFAULT ''"]
