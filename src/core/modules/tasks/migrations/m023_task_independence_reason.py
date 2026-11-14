from engine.database.migration import Migration


class TaskIndependenceReasonMigration(Migration):
    """Keeps why a task in a plan waits on no other task."""

    number = 23
    statements = ["ALTER TABLE tasks ADD COLUMN independence_reason TEXT NOT NULL DEFAULT ''"]
