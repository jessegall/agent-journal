from core.base.database.migration import Migration


class AllEnvironmentsTaskStateIndexMigration(Migration):
    """Indexes tasks in each state, for reads across all environments."""

    number = 16
    statements = ["CREATE INDEX tasks_state ON tasks (state, id)"]
