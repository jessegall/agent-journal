from engine.database.migration import Migration


class OutputReadPositionMigration(Migration):
    """Adds the offset examined by the reader, including an unfinished last line."""

    number = 53
    statements = ["ALTER TABLE outputs ADD COLUMN seen_offset INTEGER NOT NULL DEFAULT 0"]
