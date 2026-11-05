from core.base.database.migration import Migration


class ReaderRequestOwnerMigration(Migration):
    """Keeps open reader requests separate for each agent and exact command."""

    number = 40
    statements = (
        "DROP INDEX reader_requests_open_command",
        "CREATE UNIQUE INDEX reader_requests_open_command ON reader_requests(environment_id, creator_id, command)"
        " WHERE completed_at IS NULL",
    )
