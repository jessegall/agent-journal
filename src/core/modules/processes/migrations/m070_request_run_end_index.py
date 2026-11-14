from engine.database.migration import Migration


class RequestRunEndIndexMigration(Migration):
    """Lets the age pruning of request rows, which reads every environment's oldest rows, find them without reading
    the whole table; a journal that already has the index keeps it."""

    number = 70
    statements = ["CREATE INDEX request_runs_ended ON request_runs(ended_at, id)"]
