from core.base.database.migration import Migration


class WorktreeSplitIndexesMigration(Migration):
    """Indexes recent dispatch counts within an environment and across the project."""

    number = 37
    statements = [
        "CREATE INDEX worker_worktrees_recent_cut ON worker_worktrees (cut_at DESC, id DESC) WHERE cut_at IS NOT NULL",
        "CREATE INDEX worker_worktrees_environment_cut ON worker_worktrees (environment_id, cut_at DESC, id DESC) WHERE cut_at IS NOT NULL",
    ]
