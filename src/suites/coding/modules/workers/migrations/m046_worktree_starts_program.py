from core.base.database.migration import Migration


class WorktreeStartsProgramMigration(Migration):
    """Records whether the journal starts the worker's program once its worktree is cut."""

    number = 46
    statements = ["ALTER TABLE worker_worktrees ADD COLUMN starts_program INTEGER NOT NULL DEFAULT 1"]
