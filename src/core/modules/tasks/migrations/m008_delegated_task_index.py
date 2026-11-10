from engine.database.migration import Migration


class DelegatedTaskIndexMigration(Migration):
    """Indexes delegated tasks for their agent."""

    number = 8
    statements = tuple(["CREATE INDEX tasks_delegated_to ON tasks (delegated_to, state) WHERE delegated_to IS NOT NULL"])
