from core.base.database.migration import Migration


class WorkerQueueReadIndexesMigration(Migration):
    """Indexes worktree history and queued tests."""

    number = 14
    statements = [
        "CREATE INDEX affected_tests_worktree ON affected_tests (worktree_id, id)",
        "CREATE INDEX worker_worktrees_environment ON worker_worktrees (environment_id, id)",
        "CREATE INDEX proofs_state ON proofs (state, id)",
        "CREATE INDEX affected_tests_state ON affected_tests (state, id)",
    ]
