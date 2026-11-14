from engine.database.migration import Migration


class MergeAskStateIndexMigration(Migration):
    """Indexes the asks for a merge by environment and state, so the waiting asks are read without a scan."""

    number = 75
    statements = ["CREATE INDEX worker_merge_asks_environment_state ON worker_merge_asks (environment_id, state, worktree_id)"]
