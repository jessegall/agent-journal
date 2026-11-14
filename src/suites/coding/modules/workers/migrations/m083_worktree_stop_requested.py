from engine.database.migration import Migration


class WorktreeStopRequestedMigration(Migration):
    """Keeps on a worktree when its worker was told to stop after its commit so its stop compacts it, so the hook that
    reads it sees what the commit wrote."""

    number = 83
    statements = ["ALTER TABLE worker_worktrees ADD COLUMN stop_requested_at TEXT"]
