from core.base.database.migration import Migration


class AliasCategoryMigration(Migration):
    """Adds the category an alias declares for the line it runs."""

    number = 2
    statements = ["ALTER TABLE aliases ADD COLUMN category TEXT"]
