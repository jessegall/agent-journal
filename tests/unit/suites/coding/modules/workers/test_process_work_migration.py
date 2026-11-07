import sqlite3

from suites.coding.modules.workers.migrations.m007_process_work import ProofProcessWorkMigration


def test_existing_proof_processes_keep_their_worker_and_task():
    connection = sqlite3.connect(":memory:")
    try:
        connection.executescript("""
            CREATE TABLE processes (id INTEGER PRIMARY KEY, owner_agent_id INTEGER, task_id INTEGER);
            CREATE TABLE worker_worktrees (id INTEGER PRIMARY KEY, agent_id INTEGER);
            CREATE TABLE proofs (process_id INTEGER, worktree_id INTEGER, task_id INTEGER);
            INSERT INTO processes VALUES (1, NULL, NULL), (2, NULL, NULL);
            INSERT INTO worker_worktrees VALUES (3, 42);
            INSERT INTO proofs VALUES (1, 3, 17);
        """)
        for statement in ProofProcessWorkMigration.statements:
            connection.execute(statement)
        assert connection.execute("SELECT id, owner_agent_id, task_id FROM processes ORDER BY id").fetchall() == [(1, 42, 17), (2, None, None)]
    finally:
        connection.close()
