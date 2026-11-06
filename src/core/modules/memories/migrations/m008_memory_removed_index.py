from core.base.database.migration import Migration


class MemoryRemovedIndexMigration(Migration):
    """Indexes memories by whether they were removed, as every list leaves the removed ones out."""

    number = 8
    statements = ["CREATE INDEX memories_removed ON memories (removed_at, id)"]
