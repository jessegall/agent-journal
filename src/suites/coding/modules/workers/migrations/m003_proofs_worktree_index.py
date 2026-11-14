from engine.database.migration import Migration


class ProofsWorktreeIndexMigration(Migration):
    """A worktree's proofs are found through an index, as the points window reads them with the worktree."""

    number = 3
    statements = ["CREATE INDEX proofs_worktree ON proofs (worktree_id, point)"]
