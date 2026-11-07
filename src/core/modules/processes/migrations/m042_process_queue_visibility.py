from core.base.database.migration import Migration


class ProcessQueueVisibilityMigration(Migration):
    """Replaces the queue view with queue members and main-agent tests and builds."""

    number = 42
    statements = ["DROP VIEW IF EXISTS process_queue_rows"]
