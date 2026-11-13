import sqlite3

from suites.coding.modules.workers.migrations.m081_helper_role_keys import HelperRoleKeysMigration

ROWS = [(1, "verifier", ""), (2, "reviewer", ""), (3, "helper", "journal-merger"), (4, "helper", "journal-researcher"),
        (5, "worker", "journal-worker-medior"), (6, "main", "")]
MIGRATED = [(1, "helper"), (2, "helper"), (3, "merger"), (4, "helper"), (5, "worker"), (6, "main")]


def agents_table() -> sqlite3.Connection:
    database = sqlite3.connect(":memory:")
    database.execute("CREATE TABLE agents (id INTEGER PRIMARY KEY, role TEXT NOT NULL, profile TEXT NOT NULL)")
    database.executemany("INSERT INTO agents VALUES (?, ?, ?)", ROWS)
    return database


def migrated(database: sqlite3.Connection, statements) -> list[tuple]:
    for statement in statements:
        database.execute(statement)
    return database.execute("SELECT id, role FROM agents ORDER BY id").fetchall()


def test_verifier_and_reviewer_rows_become_helpers_and_a_merger_profile_helper_a_merger():
    assert migrated(agents_table(), HelperRoleKeysMigration.statements) == MIGRATED


def test_a_second_run_changes_nothing():
    database = agents_table()
    migrated(database, HelperRoleKeysMigration.statements)
    assert migrated(database, HelperRoleKeysMigration.statements) == MIGRATED


def test_a_run_stopped_half_way_finishes_on_the_next_run():
    database = agents_table()
    migrated(database, HelperRoleKeysMigration.statements[:1])
    assert migrated(database, HelperRoleKeysMigration.statements) == MIGRATED


def test_a_row_of_another_role_is_left_alone():
    rows = dict(migrated(agents_table(), HelperRoleKeysMigration.statements))
    assert (rows[5], rows[6]) == ("worker", "main")
