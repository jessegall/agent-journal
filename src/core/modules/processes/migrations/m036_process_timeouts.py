from core.base.database.migration import Migration


class ProcessTimeoutMigration(Migration):
    """Stores optional run timeouts and when they expire."""

    number = 36
    statements = ["ALTER TABLE processes ADD COLUMN timeout_seconds INTEGER",
                  "ALTER TABLE processes ADD COLUMN expired_at TEXT"]
