from engine.database.rebuild_migration import RebuildMigration


class DropTaskDelegationMigration(RebuildMigration):
    """Drops the column delegated_to and its index: the assignments table says who a task is given to."""

    number = 26
    statements = ["DROP INDEX IF EXISTS tasks_delegated_to", "ALTER TABLE tasks DROP COLUMN delegated_to"]
