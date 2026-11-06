from core.base.database.migration import Migration


class OutputSeenOffsetMigration(Migration):
    """An output keeps how far its reader has looked, which passes an unfinished last line that the read offset stops before."""

    number = 53
    statements = ["ALTER TABLE outputs ADD COLUMN seen_offset INTEGER NOT NULL DEFAULT 0"]
