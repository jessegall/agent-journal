from core.base.database.migration import Migration


class WorkerReadIndexesMigration(Migration):
    """Indexes active worktrees and the tests attached to a process."""

    number = 13
    statements = [
        "CREATE INDEX worker_worktrees_open_environment ON worker_worktrees (environment_id, id) WHERE removed_at IS NULL",
        "CREATE INDEX proofs_process_state ON proofs (process_id, state)",
        "CREATE INDEX affected_tests_process_state ON affected_tests (process_id, state)",
    ]
