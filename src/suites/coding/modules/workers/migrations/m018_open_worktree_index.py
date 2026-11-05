from core.base.database.migration import Migration


class OpenWorktreeIndexMigration(Migration):
    """Indexes the worktrees not yet removed, for reads across all environments."""

    number = 18
    statements = ["CREATE INDEX worker_worktrees_open ON worker_worktrees (id) WHERE removed_at IS NULL"]
