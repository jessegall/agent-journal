from core.base.database.migration import Migration


class WorktreeFolderIndexMigration(Migration):
    """Finds the worktrees that hold a file by their folder without reading the whole table."""

    number = 57
    statements = ["CREATE INDEX worker_worktrees_folder ON worker_worktrees (folder)"]
