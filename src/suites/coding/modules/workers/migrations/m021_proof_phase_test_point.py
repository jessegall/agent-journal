from core.base.database.rebuild_migration import RebuildMigration

PROOF_COLUMNS = "id, task_id, worktree_id, creator_id, point, text, shortfall, state, version, metadata, created_at, updated_at, test_command, process_id"


class ProofPhaseTestPointMigration(RebuildMigration):
    """A proof may stand at point 0, which holds the test command a phase names."""

    number = 21
    statements = [
        "CREATE TABLE proofs_new (id INTEGER PRIMARY KEY, task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE RESTRICT,"
        " worktree_id INTEGER NOT NULL REFERENCES worker_worktrees(id) ON DELETE RESTRICT, creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT,"
        " point INTEGER NOT NULL CHECK (point >= 0), text TEXT NOT NULL, shortfall TEXT NOT NULL DEFAULT '', state TEXT NOT NULL DEFAULT 'shown',"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL, test_command TEXT NOT NULL DEFAULT '', process_id INTEGER, UNIQUE (worktree_id, task_id, point)) STRICT",
        f"INSERT INTO proofs_new ({PROOF_COLUMNS}) SELECT {PROOF_COLUMNS} FROM proofs",
        "DROP TABLE proofs",
        "ALTER TABLE proofs_new RENAME TO proofs",
        "CREATE INDEX proofs_task ON proofs (task_id, point)",
        "CREATE INDEX proofs_worktree ON proofs (worktree_id, point)",
        "CREATE INDEX proofs_process_state ON proofs (process_id, state)",
        "CREATE INDEX proofs_state ON proofs (state, id)",
    ]
