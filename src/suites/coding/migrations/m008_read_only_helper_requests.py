from core.base.database.migration import Migration

MOVED_KEYS = [("journal.suites.coding.main-starts-helpers", "journal.suites.coding.main-starts-read-only-helpers"),
              ("journal.suites.coding.workers.workers-start-helpers", "journal.suites.coding.workers.workers-start-read-only-helpers")]


class ReadOnlyHelperRequestsMigration(Migration):
    """Requests for the coding settings renamed for read-only helpers keep their setting."""

    number = 8
    statements = [f"UPDATE setting_requests SET key = '{new}' WHERE key = '{old}'" for old, new in MOVED_KEYS]
