from core.base.database.migration import Migration


class PlainColumnNamesMigration(Migration):
    """Renames the columns whose names were not plain words."""

    number = 9
    statements = ["ALTER TABLE plugin_outputs RENAME COLUMN shows_in_environment TO is_environment_visible"]
