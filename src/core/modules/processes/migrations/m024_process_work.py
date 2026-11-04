from core.base.database.migration import Migration


class ProcessWorkMigration(Migration):
    """Keeps the task associated with a process."""

    number = 24
    statements = ["ALTER TABLE processes ADD COLUMN task_id INTEGER REFERENCES tasks(id)"]
