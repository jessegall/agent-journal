from engine.database.migration import Migration


class ResumedTimeColumnMigration(Migration):
    """Names the time an agent was resumed after its compaction resumed_at."""

    number = 63
    statements = ["ALTER TABLE context_compactions RENAME COLUMN woken_at TO resumed_at"]
