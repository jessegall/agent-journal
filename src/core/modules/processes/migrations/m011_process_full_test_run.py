from engine.database.migration import Migration


class ProcessFullTestRunMigration(Migration):
    """A run keeps whether it runs a whole test suite, as a pass of it closes the tasks in testing."""

    number = 11
    statements = tuple(["ALTER TABLE processes ADD COLUMN is_full_test_run INTEGER NOT NULL DEFAULT 0"])
