from core.base.database.migration import Migration


class PausedTasksBlocked(Migration):
    """Turns every paused task into a blocked one, since tasks have no paused state."""

    number = 2
    statements = (
        "UPDATE tasks SET state = 'blocked' WHERE state = 'paused'",
    )
