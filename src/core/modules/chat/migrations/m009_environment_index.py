from engine.database.migration import Migration


class JournalExceptionsEnvironmentIndexMigration(Migration):
    """Indexes journal exceptions by environment, so the list of one environment reads no other row."""

    number = 9
    statements = [
        "CREATE INDEX journal_exceptions_environment ON journal_exceptions (environment_id, id)",
    ]
