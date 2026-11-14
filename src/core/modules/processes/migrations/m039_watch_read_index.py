from engine.database.migration import Migration


class WatchReadIndexMigration(Migration):
    """Indexes the open watches of a process."""

    number = 39
    statements = ["CREATE INDEX watches_process_state ON watches (process_id, state)"]
