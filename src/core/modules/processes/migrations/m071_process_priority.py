from engine.database.migration import Migration


class ProcessPriorityMigration(Migration):
    """Stores where a waiting run stands among the others: high, normal or low."""

    number = 71
    statements = ["ALTER TABLE processes ADD COLUMN priority TEXT NOT NULL DEFAULT 'normal'"]
