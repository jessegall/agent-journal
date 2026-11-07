from core.base.database.migration import Migration


class WorktreeDeliveredAtMigration(Migration):
    number = 32
    statements = [
        "ALTER TABLE worker_worktrees ADD COLUMN delivered_at TEXT",
        "UPDATE worker_worktrees SET delivered_at = updated_at WHERE state = 'delivered' OR "
        "(state = 'cut' AND EXISTS (SELECT 1 FROM proofs WHERE proofs.worktree_id = worker_worktrees.id))",
    ]
