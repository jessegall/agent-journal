from engine.database.migration import Migration


class OpenReaderRequestIndexMigration(Migration):
    """Indexes the open reader requests by id, so walking them in order reads only the open ones."""

    number = 74
    statements = ["CREATE INDEX IF NOT EXISTS reader_requests_open ON reader_requests (id) WHERE completed_at IS NULL"]
