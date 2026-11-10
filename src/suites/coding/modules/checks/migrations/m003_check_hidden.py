from engine.database.migration import Migration


class CheckHiddenMigration(Migration):
    """A check can be hidden from the checks window, as the check of a blocked task's wait is."""

    number = 3
    statements = ["ALTER TABLE checks ADD COLUMN hidden INTEGER NOT NULL DEFAULT 0",
                  "UPDATE checks SET hidden = 1 WHERE task_wait_id IS NOT NULL"]
