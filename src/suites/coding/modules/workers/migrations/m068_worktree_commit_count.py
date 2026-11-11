from engine.database.migration import Migration


class WorktreeCommitCountMigration(Migration):
    """A worktree counts the commits of its worker, so the test runs a worker may start itself are counted
    anew after each commit."""

    number = 68
    statements = tuple(["ALTER TABLE worker_worktrees ADD COLUMN commit_count INTEGER NOT NULL DEFAULT 0"])
