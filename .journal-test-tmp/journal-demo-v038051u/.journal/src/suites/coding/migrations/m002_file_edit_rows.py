from core.base.database.migration import Migration


class FileEditRowsMigration(Migration):
    """A file edit keeps the lines it changed and whether it made the file, for the file feed's diff cards."""

    number = 2
    statements = ("ALTER TABLE file_edits ADD COLUMN rows TEXT NOT NULL DEFAULT '[]'", "ALTER TABLE file_edits ADD COLUMN edit_type TEXT NOT NULL DEFAULT 'edit'")
