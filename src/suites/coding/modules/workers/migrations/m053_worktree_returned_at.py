from engine.database.migration import Migration


class WorkerReturnMigration(Migration):
    """Renames the worktree column that holds when a worker was returned to the main agent."""

    number = 53
    statements = ["ALTER TABLE worker_worktrees RENAME COLUMN handed_to_main_at TO returned_at"]
