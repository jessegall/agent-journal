from engine.database.migration import Migration


class FileEditOldPathMigration(Migration):
    """Adds the column that holds the path a moved file came from, empty for an edit that is no move."""

    number = 12
    statements = ["ALTER TABLE file_edits ADD COLUMN moved_from TEXT NOT NULL DEFAULT ''"]
