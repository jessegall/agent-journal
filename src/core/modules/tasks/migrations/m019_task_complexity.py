from engine.database.migration import Migration


class TaskComplexityMigration(Migration):
    """Adds an optional complexity score to tasks."""

    number = 19
    statements = ["ALTER TABLE tasks ADD COLUMN complexity INTEGER"]
