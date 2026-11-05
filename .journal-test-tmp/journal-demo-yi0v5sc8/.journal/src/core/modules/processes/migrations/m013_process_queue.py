from core.base.database.migration import Migration


class ProcessQueueMigration(Migration):
    """A run keeps whether it waits for a spot in the machine's run queue."""

    number = 13
    statements = tuple(["ALTER TABLE processes ADD COLUMN is_queued INTEGER NOT NULL DEFAULT 0"])
