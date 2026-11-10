from engine.database.migration import Migration


class WorktreeTestsPassedMigration(Migration):
    """Records when a worker's tests passed, which wakes the merger."""

    number = 29
    statements = ["ALTER TABLE worker_worktrees ADD COLUMN tests_passed_at TEXT"]
