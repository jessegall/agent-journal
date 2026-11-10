from engine.database.migration import Migration


class WorkerCapKeysMigration(Migration):
    """Moves the worker limit to the worker run limit, which keeps its value at each level."""

    number = 24
    statements = ["DELETE FROM settings WHERE key = 'journal.suites.coding.workers.worker-limit'"
                  " AND EXISTS (SELECT 1 FROM settings AS newer WHERE newer.key = 'journal.suites.coding.workers.worker-run-limit'"
                  " AND newer.environment_id IS settings.environment_id)",
                  "UPDATE settings SET key = 'journal.suites.coding.workers.worker-run-limit' WHERE key = 'journal.suites.coding.workers.worker-limit'"]
