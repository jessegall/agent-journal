import sqlite3

from suites.coding.modules.workers.migrations.m064_merge_ready_at import MergeReadyMigration

PASSED_AT = "2026-10-31T09:00:00.000000+00:00"


def test_the_upgrade_makes_a_worktree_whose_tests_passed_ready_to_merge_since_then_and_leaves_the_others():
    database = sqlite3.connect(":memory:")
    database.execute("CREATE TABLE worker_worktrees (id INTEGER PRIMARY KEY, tests_passed_at TEXT)")
    database.execute("INSERT INTO worker_worktrees VALUES (1, ?), (2, NULL)", [PASSED_AT])
    for statement in MergeReadyMigration.statements:
        database.execute(statement)
    assert database.execute("SELECT id, merge_ready_at FROM worker_worktrees ORDER BY id").fetchall() == [(1, PASSED_AT), (2, None)]
