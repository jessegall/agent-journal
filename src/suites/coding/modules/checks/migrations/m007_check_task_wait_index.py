from engine.database.migration import Migration


class CheckTaskWaitIndexMigration(Migration):
    """Indexes every check attached to a task wait."""

    number = 7
    statements = ["CREATE INDEX checks_task_wait ON checks (task_wait_id)"]
