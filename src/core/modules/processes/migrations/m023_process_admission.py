from engine.database.migration import Migration


class ProcessAdmissionMigration(Migration):
    """Keeps the admission time and spot ownership on each process."""

    number = 23
    statements = [
        "ALTER TABLE processes ADD COLUMN started_at TEXT",
        "ALTER TABLE processes ADD COLUMN slot_assigned INTEGER NOT NULL DEFAULT 0",
        "UPDATE processes SET started_at = created_at WHERE is_queued = 0",
        "UPDATE processes SET slot_assigned = 1 WHERE is_queue_run = 1 AND is_queued = 0 AND state IN ('running', 'background')",
    ]
