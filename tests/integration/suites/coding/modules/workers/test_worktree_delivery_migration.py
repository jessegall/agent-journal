import sqlite3

from suites.coding.modules.workers.migrations.m037_worktree_delivery import WorktreeDeliveryMigration


def test_existing_work_uses_delivery_events_and_an_unsubmitted_cut_keeps_no_place():
    with sqlite3.connect(":memory:") as database:
        database.executescript("""
            CREATE TABLE worker_worktrees (id INTEGER PRIMARY KEY, environment_id INTEGER, session_agent_id INTEGER,
                                          state TEXT, updated_at TEXT, removed_at TEXT);
            CREATE TABLE events (row_table TEXT, row_id INTEGER, name TEXT, created_at TEXT);
            INSERT INTO worker_worktrees VALUES (1, 1, 1, 'delivered', '2026-11-03', NULL);
            INSERT INTO worker_worktrees VALUES (2, 1, 2, 'cut', '2026-11-03', NULL);
            INSERT INTO worker_worktrees VALUES (3, 1, 3, 'cut', '2026-11-03', NULL);
            INSERT INTO worker_worktrees VALUES (4, 1, 4, 'delivered', '2026-11-03', NULL);
            INSERT INTO events VALUES ('worker_worktrees', 1, 'worker_worktree.deliver', '2026-11-01');
            INSERT INTO events VALUES ('worker_worktrees', 2, 'worker_worktree.deliver', '2026-11-02');
        """)
        for statement in WorktreeDeliveryMigration.statements:
            database.execute(statement)
        assert database.execute("SELECT id, delivered_at FROM worker_worktrees ORDER BY id").fetchall() == [
            (1, "2026-11-01"), (2, "2026-11-02"), (3, None), (4, "2026-11-03"),
        ]
