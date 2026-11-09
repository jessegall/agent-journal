from core.base.database.migration import Migration


class PlainColumnNamesMigration(Migration):
    """Renames the columns whose names were not plain words."""

    number = 52
    statements = ["ALTER TABLE worker_worktrees RENAME COLUMN left_to_main_at TO handed_to_main_at",
                  "ALTER TABLE merge_followups RENAME COLUMN commit_before TO previous_commit"]
