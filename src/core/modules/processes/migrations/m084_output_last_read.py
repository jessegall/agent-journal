from engine.database.migration import Migration


class OutputLastReadMigration(Migration):
    """An output keeps when it was last read beside when it was first read, so a block that waits for a read since
    it opened sees a read of a run read before, such as a silent run read while it still went."""

    number = 84
    statements = tuple(["ALTER TABLE outputs ADD COLUMN last_read_at TEXT", "UPDATE outputs SET last_read_at = read_at"])
