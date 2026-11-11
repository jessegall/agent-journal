import sqlite3

from suites.coding.modules.workers.migrations.m066_drop_phase_test_settings import DropPhaseTestSettingsMigration

PHASE_END_KEY = "journal.suites.coding.workers.test-at-phase-end"
BATCH_KEY = "journal.suites.coding.workers.test-batch-size"
KEPT_KEY = "journal.suites.coding.workers.worker-phase-test-runs"


def upgraded() -> sqlite3.Connection:
    database = sqlite3.connect(":memory:")
    database.execute("CREATE TABLE settings (id INTEGER PRIMARY KEY, key TEXT, value TEXT)")
    database.execute("CREATE TABLE proofs (id INTEGER PRIMARY KEY, point INTEGER, state TEXT)")
    database.execute("CREATE TRIGGER proofs_rule_state_delete BEFORE DELETE ON proofs BEGIN SELECT RAISE(ABORT, 'rule: a proof in that state cannot be deleted'); END")
    database.executemany("INSERT INTO settings (key, value) VALUES (?, ?)", [(PHASE_END_KEY, "false"), (BATCH_KEY, "4"), (BATCH_KEY, "2"), (KEPT_KEY, "5")])
    database.executemany("INSERT INTO proofs (id, point, state) VALUES (?, ?, ?)",
                         [(1, 0, "short"), (2, 0, "shown"), (3, 0, "checked"), (4, 0, "queued"), (5, 0, "running"), (6, 1, "short"), (7, 1, "shown")])
    for statement in DropPhaseTestSettingsMigration.statements:
        database.execute(statement)
    return database


def test_the_upgrade_leaves_no_stored_value_of_the_two_removed_settings_and_keeps_every_other_setting():
    assert upgraded().execute("SELECT key, value FROM settings").fetchall() == [(KEPT_KEY, "5")]


def test_the_upgrade_deletes_the_proofs_of_point_zero_that_were_never_checked_and_no_other_proof():
    kept = upgraded().execute("SELECT id, point, state FROM proofs ORDER BY id").fetchall()
    assert kept == [(3, 0, "checked"), (4, 0, "queued"), (5, 0, "running"), (6, 1, "short"), (7, 1, "shown")]
