from engine.database.migration import Migration


class WorktreeCommitCountMigration(Migration):
    """A worktree counts the commits of its worker, so the test runs a worker may start itself are counted
    anew after each commit, and records the tasks its newest git commit took, so the rows of exactly those
    tasks move when the commit is recorded."""

    number = 68
    statements = (
        "ALTER TABLE worker_worktrees ADD COLUMN commit_count INTEGER NOT NULL DEFAULT 0",
        "ALTER TABLE worker_worktrees ADD COLUMN commit_task_ids TEXT NOT NULL DEFAULT ''",
    )
