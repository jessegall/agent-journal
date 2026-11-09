from core.base.database.migration import Migration


class PlainColumnNamesMigration(Migration):
    """Renames the columns whose names were not plain words."""

    number = 18
    statements = ["ALTER TABLE agents RENAME COLUMN limited_until TO usage_limit_ends_at"]
