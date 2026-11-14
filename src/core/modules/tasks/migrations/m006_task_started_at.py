from engine.database.migration import Migration


class TaskStartTimeMigration(Migration):
    """A task keeps when it was last started, which orders the tasks an agent holds."""

    number = 6
    statements = ("ALTER TABLE tasks ADD COLUMN started_at TEXT", "UPDATE tasks SET started_at = updated_at WHERE state = 'started'")
