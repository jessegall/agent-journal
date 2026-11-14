from engine.database.migration import Migration


class DropWorkerRefusalsTotalMigration(Migration):
    """Removes the total of a worker's refusals from its row: the shared countdowns keep it."""

    number = 59
    statements = ["ALTER TABLE worker_refusal_counts DROP COLUMN count"]
