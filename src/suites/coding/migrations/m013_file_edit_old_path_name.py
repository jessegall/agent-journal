from engine.database.migration import Migration


class FileEditOldPathNameMigration(Migration):
    """Renames the column of the path a moved file came from to old_path."""

    number = 13
    statements = ["ALTER TABLE file_edits RENAME COLUMN moved_from TO old_path"]
