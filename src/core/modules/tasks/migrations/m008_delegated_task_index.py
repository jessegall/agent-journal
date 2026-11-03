from core.base.database.migration import Migration


class DelegatedTaskIndexMigration(Migration):
    """An index for the tasks of a worker, which each of its stops, deliveries and test ends asks for."""

    number = 8
    statements = tuple(["CREATE INDEX tasks_delegated_to ON tasks (delegated_to, state) WHERE delegated_to IS NOT NULL"])
