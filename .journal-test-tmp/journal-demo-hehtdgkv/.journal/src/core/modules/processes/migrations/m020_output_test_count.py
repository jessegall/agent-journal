from core.base.database.migration import Migration


class OutputTestCountMigration(Migration):
    """Outputs keep the number of tests the reader found."""

    number = 20
    statements = ["ALTER TABLE outputs ADD COLUMN test_count INTEGER NOT NULL DEFAULT 0"]
