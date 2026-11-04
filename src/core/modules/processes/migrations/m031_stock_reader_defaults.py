from core.base.database.migration import Migration


class StockReaderDefaultsMigration(Migration):
    """Takes the default off the core's readers, so a reader a project adds for the same command comes first."""

    number = 31
    statements = ["UPDATE readers SET is_default = 0 WHERE creator_id = 1"]
