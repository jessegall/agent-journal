from engine.database.migration import Migration


class ExecutionClassPoolMigration(Migration):
    """An execution class names the pool it runs in by the column its field uses; the column's old checks go
    before, and the sync writes them again."""

    number = 86
    statements = [
        "DROP TRIGGER IF EXISTS execution_classes_rule_lane_insert", "DROP TRIGGER IF EXISTS execution_classes_rule_lane_update",
        "ALTER TABLE execution_classes RENAME COLUMN lane TO pool",
    ]
