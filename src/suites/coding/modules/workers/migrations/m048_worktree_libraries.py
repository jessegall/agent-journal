from core.base.database.migration import Migration


class WorktreeLibrariesMigration(Migration):
    """Records the library folders a worktree copied in and when they were removed from a stopped worker's worktree."""

    number = 48
    statements = ["ALTER TABLE worker_worktrees ADD COLUMN library_copies TEXT NOT NULL DEFAULT '[]'",
                  "ALTER TABLE worker_worktrees ADD COLUMN libraries_dropped_at TEXT"]
