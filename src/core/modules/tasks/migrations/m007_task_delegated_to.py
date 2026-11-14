from engine.database.migration import Migration


class TaskDelegationMigration(Migration):
    """Records the agent to which a task is delegated."""

    number = 7
    statements = ["ALTER TABLE tasks ADD COLUMN delegated_to INTEGER"]
