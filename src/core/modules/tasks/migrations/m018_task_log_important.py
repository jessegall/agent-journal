from core.base.database.migration import Migration


class TaskLogImportantMigration(Migration):
    """Marks the log lines the main agent must read before the work is merged."""

    number = 18
    statements = ["ALTER TABLE task_logs ADD COLUMN important INTEGER NOT NULL DEFAULT 0"]
