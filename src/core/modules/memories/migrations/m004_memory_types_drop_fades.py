from core.base.database.migration import Migration


class MemoryTypesDropFadesMigration(Migration):
    """Drops the fades column of memory types: every memory fades."""

    number = 4
    statements = ["ALTER TABLE memory_types DROP COLUMN fades"]
