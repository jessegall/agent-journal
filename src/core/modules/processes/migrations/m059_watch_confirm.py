from core.base.database.migration import Migration


class WatchConfirmMigration(Migration):
    """Keeps for each watch how many wakes the agent confirmed, when it was last woken and whether a confirm
    is awaited."""

    number = 59
    statements = ["ALTER TABLE watches ADD COLUMN confirmed_count INTEGER NOT NULL DEFAULT 0",
                  "ALTER TABLE watches ADD COLUMN woke_at TEXT",
                  "ALTER TABLE watches ADD COLUMN awaits_confirm INTEGER NOT NULL DEFAULT 0"]
