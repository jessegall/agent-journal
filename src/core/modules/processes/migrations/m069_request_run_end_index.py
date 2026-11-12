from engine.database.migration import Migration


class RequestRunEndIndexMigration(Migration):
    """Gives a journal that ran migration 68 before it named the index of request rows by their end alone that index,
    so the pruning of old request rows across all environments reads no whole table."""

    number = 69
    statements = ["CREATE INDEX IF NOT EXISTS request_runs_ended ON request_runs(ended_at, id)"]
