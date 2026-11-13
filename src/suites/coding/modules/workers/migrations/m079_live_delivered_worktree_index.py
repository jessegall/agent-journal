from engine.database.migration import Migration


class ActiveDeliveredWorktreeIndexMigration(Migration):
    """Indexes the delivered worktrees still in use, so the work review of the worker cards reads only them."""

    number = 79
    statements = ["CREATE INDEX IF NOT EXISTS worker_worktrees_live_delivered ON worker_worktrees (session_agent_id)"
                  " WHERE delivered_at IS NOT NULL AND removed_at IS NULL AND state IN ('cut', 'delivered')"]
