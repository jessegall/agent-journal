from engine.database.migration import Migration


class AliasCategoryIndexMigration(Migration):
    """Indexes the aliases of a category by key, which a saved command walks to check it against the others."""

    number = 7
    statements = ["CREATE INDEX IF NOT EXISTS aliases_category ON aliases (category, id)"]
