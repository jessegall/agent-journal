from engine.database.migration import Migration


class MergeReadyMigration(Migration):
    """A worktree records when it became ready to merge: when its tests passed, or, in a started plan, at its
    final commit. A worktree whose tests passed before the upgrade is ready since then."""

    number = 64
    statements = (
        "ALTER TABLE worker_worktrees ADD COLUMN merge_ready_at TEXT",
        "UPDATE worker_worktrees SET merge_ready_at = tests_passed_at WHERE tests_passed_at IS NOT NULL",
    )
