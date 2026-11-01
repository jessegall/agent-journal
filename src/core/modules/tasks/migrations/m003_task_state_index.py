from core.base.database.migration import Migration


class TaskStateIndexMigration(Migration):
    """A state's tasks are paged newest first through an index, closed ones too, which the open-tasks index
    leaves out."""

    number = 3
    statements = tuple(["CREATE INDEX tasks_environment_state ON tasks (environment_id, state, id)"])
