from core.base.database.migration import Migration


class ReaderRequestEnvironmentIndexMigration(Migration):
    """Indexes the reader requests of an environment."""

    number = 51
    statements = ["CREATE INDEX reader_requests_environment ON reader_requests (environment_id, id)"]
