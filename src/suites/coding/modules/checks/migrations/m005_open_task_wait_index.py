from core.base.database.migration import Migration


class OpenTaskWaitIndexMigration(Migration):
    """Indexes task waits on checks that have not been removed."""

    number = 5
    statements = ["CREATE INDEX checks_open_task_wait ON checks (task_wait_id) WHERE removed_at IS NULL"]
