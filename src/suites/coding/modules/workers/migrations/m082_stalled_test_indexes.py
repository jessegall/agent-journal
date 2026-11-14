from engine.database.migration import Migration


class StalledTestIndexesMigration(Migration):
    """Indexes what the stalled-tests tick reads every minute: the checkpoint tests by state, and the signature of
    all worktrees, removed ones included, so neither read scans its table."""

    number = 82
    statements = ["CREATE INDEX IF NOT EXISTS checkpoint_tests_state ON checkpoint_tests (state, id)",
                  "CREATE INDEX IF NOT EXISTS worker_worktrees_signature ON worker_worktrees (id, version, updated_at)"]
