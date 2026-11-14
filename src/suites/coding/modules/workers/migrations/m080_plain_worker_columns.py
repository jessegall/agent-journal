from engine.database.migration import Migration


class PlainWorkerColumnsMigration(Migration):
    """Names a merge ask of a whole unit is_full, an update's outcome update_outcome, the commits a worktree lags
    its base commits_lagging, the actor who decided a behind check decider_id, and the time of the last check
    of an environment's worktrees checked_at."""

    number = 80
    statements = ["ALTER TABLE worker_merge_asks RENAME COLUMN is_whole TO is_full",
                  "ALTER TABLE worker_operations RENAME COLUMN update_result TO update_outcome",
                  "ALTER TABLE worktree_behind_checks RENAME COLUMN behind TO commits_lagging",
                  "ALTER TABLE worktree_behind_checks RENAME COLUMN decided_by TO decider_id",
                  "ALTER TABLE worktree_behind_looks RENAME COLUMN looked_at TO checked_at"]
