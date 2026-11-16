from engine.database.migration import Migration


class RemovedRunBatchSizeMigration(Migration):
    """Deletes the stored runs-at-once setting, whose value migration 81 carried into the long lane's capacity."""

    number = 82
    statements = ("DELETE FROM settings WHERE key = 'journal.core.processes.run-batch-size'",)
