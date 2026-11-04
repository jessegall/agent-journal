from core.base.database.migration import Migration


class ProcessQueueTimestampMigration(Migration):
    """Replaces the queue flag with the time a process joined the queue."""

    number = 35
    statements = [
        "DROP VIEW IF EXISTS process_queue_rows",
        "DROP VIEW IF EXISTS worker_waits",
        "ALTER TABLE processes ADD COLUMN queued_at TEXT",
        "UPDATE processes SET queued_at = created_at WHERE is_queued = 1 AND state IN ('running', 'background')",
        "ALTER TABLE processes DROP COLUMN is_queued",
    ]
