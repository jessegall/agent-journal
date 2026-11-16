from engine.database.migration import Migration


class WorkerOperationUpdateResultMigration(Migration):
    """A worker operation keeps how an update of the worktree ended, so its finished line is chosen by that result
    and not by the exit code: a conflicting update ends with exit code 0."""

    number = 77
    statements = ("ALTER TABLE worker_operations ADD COLUMN update_result TEXT",)
