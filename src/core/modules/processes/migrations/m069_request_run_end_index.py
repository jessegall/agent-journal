from engine.database.migration import Migration


class RequestRunEndIndexMigration(Migration):
    """Lets the age pruning of request rows, which reads every environment's oldest rows, find them without reading
    the whole table; a journal that already has the index keeps it."""

    number = 69
    statements = ["CREATE INDEX IF NOT EXISTS request_runs_ended ON request_runs(ended_at, id)"]
