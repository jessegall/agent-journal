from engine.database.migration import Migration


class OutputReaderPositionMigration(Migration):
    """An output keeps the position of the part its reader reads, 0 for all parts."""

    number = 14
    statements = tuple(["ALTER TABLE outputs ADD COLUMN reader_position INTEGER NOT NULL DEFAULT 0"])
