from core.base.database.migration import Migration


class WorktreeRouteMigration(Migration):
    """Records the number of dispatched tasks and the reason for the program choice."""

    number = 38
    statements = ["ALTER TABLE worker_worktrees ADD COLUMN task_count INTEGER NOT NULL DEFAULT 1",
                  "ALTER TABLE worker_worktrees ADD COLUMN route_reason TEXT NOT NULL DEFAULT ''"]
