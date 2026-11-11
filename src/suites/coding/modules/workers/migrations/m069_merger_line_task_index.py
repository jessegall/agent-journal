from engine.database.migration import Migration


class MergerLineTaskIndexMigration(Migration):
    """Finds the open questions of a task by the task without reading the whole table: every task that is
    closed or cancelled asks for them."""

    number = 69
    statements = ["CREATE INDEX merger_lines_task ON merger_lines (task_id) WHERE task_id IS NOT NULL"]
