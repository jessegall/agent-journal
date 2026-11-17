from engine.database.migration import Migration


class RemovedWorkerKeptLimitMigration(Migration):
    """Deletes the stored worker kept limit: workers are kept with no cap, as helpers are."""

    number = 15
    statements = ("DELETE FROM settings WHERE key = 'journal.suites.coding.workers.worker-kept-limit'",)
