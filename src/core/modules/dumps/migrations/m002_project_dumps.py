from core.base.database.rebuild_migration import RebuildMigration


class ProjectDumpsMigration(RebuildMigration):
    """Removes environment ownership from existing dumps without changing their items."""

    number = 2
    statements = ["ALTER TABLE dumps DROP COLUMN environment_id"]
