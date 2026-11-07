from core.base.database.migration import Migration


class WorktreeDeliveryMigration(Migration):
    number = 35
    statements = [
        "ALTER TABLE worker_worktrees ADD COLUMN delivered_at TEXT",
        "UPDATE worker_worktrees SET delivered_at = coalesce("
        "(SELECT max(created_at) FROM events WHERE row_table = 'worker_worktrees' "
        "AND row_id = worker_worktrees.id AND name = 'worker_worktree.deliver'), "
        "CASE WHEN state = 'delivered' THEN updated_at END) WHERE state IN ('cut', 'delivered')",
        "CREATE INDEX worker_worktrees_pending ON worker_worktrees (environment_id, session_agent_id) "
        "WHERE delivered_at IS NOT NULL AND removed_at IS NULL AND state IN ('cut', 'delivered')",
    ]
