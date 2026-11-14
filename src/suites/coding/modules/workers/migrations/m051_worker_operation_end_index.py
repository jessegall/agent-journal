from engine.database.migration import Migration


class WorkerOperationEndIndexMigration(Migration):
    """Finds a worker's operation that ended after a given moment without scanning the table."""

    number = 51
    statements = ["CREATE INDEX worker_operations_worker_ended ON worker_operations (worker_id, ended_at)"]
