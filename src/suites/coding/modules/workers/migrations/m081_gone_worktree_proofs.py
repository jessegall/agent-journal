from engine.database.migration import Migration


class GoneWorktreeProofsMigration(Migration):
    """Ends the queued and running proof tests of worktrees abandoned or removed before such a worktree ended them,
    as proof 1279 of worktree 341 was left running."""

    number = 81
    statements = ["UPDATE proofs SET state = 'short', shortfall = 'ended: its worktree was abandoned or removed while this test waited or ran'"
                  " WHERE state IN ('queued', 'running') AND worktree_id IN (SELECT id FROM worker_worktrees WHERE state IN ('abandoned', 'removed'))"]
