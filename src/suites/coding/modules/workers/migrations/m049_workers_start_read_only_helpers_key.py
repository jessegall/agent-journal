from core.base.database.migration import Migration


class WorkersStartReadOnlyHelpersKeyMigration(Migration):
    """The setting that lets a worker start helpers covers read-only helpers alone, so its key now says so."""

    number = 49
    statements = ["UPDATE settings SET key = 'journal.suites.coding.workers.workers-start-read-only-helpers' WHERE key = 'journal.suites.coding.workers.workers-start-helpers'"]
