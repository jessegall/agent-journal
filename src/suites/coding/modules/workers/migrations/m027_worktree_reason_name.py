from engine.database.migration import Migration


class WorktreeReasonNameMigration(Migration):
    """Renames the column with the reason a worker started new to the plain name."""

    number = 27
    statements = ["ALTER TABLE worker_worktrees RENAME COLUMN fresh_reason TO new_agent_reason"]
