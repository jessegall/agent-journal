from core.base.database.migration import Migration


class WorkerTestSettingMigration(Migration):
    """Moves the test limit to the module that enforces it."""

    number = 8
    statements = ["UPDATE settings SET key = 'journal.suites.coding.workers.worker-run-most-tests' WHERE key = 'journal.core.processes.worker-run-most-tests'"]
