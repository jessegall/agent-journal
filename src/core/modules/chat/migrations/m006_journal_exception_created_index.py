from engine.database.migration import Migration


class JournalExceptionCreatedIndexMigration(Migration):
    """Lets a page of exceptions count and order its rows from an index instead of reading the whole table."""

    number = 6
    statements = ["CREATE INDEX IF NOT EXISTS journal_exceptions_created ON journal_exceptions (created_at)"]
