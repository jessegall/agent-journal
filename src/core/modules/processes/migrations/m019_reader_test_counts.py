from core.base.database.migration import Migration


class ReaderTestCountsMigration(Migration):
    """Readers keep their test count pattern, listing command and last proved output."""

    number = 19
    statements = [
        "ALTER TABLE readers ADD COLUMN count_pattern TEXT NOT NULL DEFAULT ''",
        "ALTER TABLE readers ADD COLUMN count_command TEXT NOT NULL DEFAULT ''",
        "ALTER TABLE readers ADD COLUMN proved_on INTEGER",
    ]
