from core.base.database.migration import Migration


class TaskDelegationMigration(Migration):
    """A task may be delegated to one worker, which takes it in turn; the assigner leaves such a task alone."""

    number = 7
    statements = ["ALTER TABLE tasks ADD COLUMN delegated_to INTEGER"]
