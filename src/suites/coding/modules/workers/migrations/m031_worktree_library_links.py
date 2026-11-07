from core.base.database.migration import Migration


class WorktreeLibraryLinksMigration(Migration):
    number = 31
    statements = ["ALTER TABLE worker_worktrees ADD COLUMN library_links TEXT NOT NULL DEFAULT '[]'"]
