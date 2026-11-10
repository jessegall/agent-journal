from engine.database.rebuild_migration import RebuildMigration


class MemoryTypesDropFadesMigration(RebuildMigration):
    """Drops the fades column of memory types: every memory fades. The views that read it are dropped first."""

    number = 4
    statements = ["ALTER TABLE memory_types DROP COLUMN fades"]
