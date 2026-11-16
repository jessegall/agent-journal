from engine.database.migration import Migration


class ActiveOperationCreatorIndexMigration(Migration):
    """Finds the merges a merger runs, by the merger that made them, without scanning the table."""

    number = 85
    statements = ["CREATE INDEX worker_operations_creator_running ON worker_operations (creator_id, name) WHERE ended_at IS NULL"]
