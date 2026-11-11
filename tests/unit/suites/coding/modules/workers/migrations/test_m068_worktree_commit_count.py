import sqlite3

from suites.coding.modules.workers.migrations.m068_worktree_commit_count import WorktreeCommitCountMigration


def test_the_upgrade_gives_each_worktree_a_commit_count_of_zero():
    database = sqlite3.connect(":memory:")
    database.execute("CREATE TABLE worker_worktrees (id INTEGER PRIMARY KEY)")
    database.execute("INSERT INTO worker_worktrees VALUES (1), (2)")
    for statement in WorktreeCommitCountMigration.statements:
        database.execute(statement)
    assert database.execute("SELECT id, commit_count FROM worker_worktrees ORDER BY id").fetchall() == [(1, 0), (2, 0)]
