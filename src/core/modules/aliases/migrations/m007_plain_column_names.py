from core.base.database.migration import Migration


class PlainColumnNamesMigration(Migration):
    """Renames the column whose name was not a plain word."""

    number = 7
    statements = ["ALTER TABLE command_types RENAME COLUMN words TO prefix_parts"]
