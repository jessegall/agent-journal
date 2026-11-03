from core.base.database.migration import Migration


class ProcessWorkMigration(Migration):
    """Keeps the originating worker and task when another agent runs its command."""

    number = 23
    statements = ["ALTER TABLE processes ADD COLUMN worker_id INTEGER REFERENCES agents(id)",
                  "ALTER TABLE processes ADD COLUMN task_id INTEGER REFERENCES tasks(id)"]
