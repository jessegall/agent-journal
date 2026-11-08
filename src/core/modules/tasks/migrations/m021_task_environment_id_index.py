from core.base.database.migration import Migration


class TaskEnvironmentIdIndexMigration(Migration):
    """Indexes an environment's tasks by ID, so a small page of them sorts nothing."""

    number = 21
    statements = ["CREATE INDEX tasks_environment_id ON tasks (environment_id, id)"]
