from engine.database.migration import Migration


class RemovedWorkerCommandTypesMigration(Migration):
    """Deletes the stored worker command types setting: a worker runs every shell command."""

    number = 14
    statements = ("DELETE FROM settings WHERE key = 'journal.suites.coding.worker-command-types'",)
