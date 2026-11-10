from engine.database.migration import Migration


class CheckTaskWaitMigration(Migration):
    """A check can be the command a blocked task waits on."""

    number = 2
    statements = ["ALTER TABLE checks ADD COLUMN task_wait_id INTEGER REFERENCES task_waits(id) ON DELETE SET NULL"]
