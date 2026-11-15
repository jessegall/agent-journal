import sqlite3

from core.modules.plans.migrations.m021_waiting_checkpoints_passed import WaitingCheckpointsPassedMigration
from engine.database.database import Database

ROWS = """
    CREATE TABLE checkpoint_reaches (id INTEGER PRIMARY KEY, environment_id INTEGER, creator_id INTEGER, plan_id INTEGER, phase_id INTEGER, source TEXT, state TEXT, updated_at TEXT);
    CREATE TABLE checkpoint_passes (id INTEGER PRIMARY KEY, environment_id INTEGER, creator_id INTEGER, plan_id INTEGER, phase_id INTEGER, passed_at TEXT, created_at TEXT, updated_at TEXT);
    INSERT INTO checkpoint_reaches VALUES (1, 1, 5, 7, 10, 'merged', 'passed', 't1'), (2, 1, 5, 7, 11, 'merged', 'failed', 't2'),
        (3, 1, 5, 7, 12, 'early', 'passed', 't3'), (4, 1, 5, 7, 13, 'merged', 'passed', 't4'), (5, 1, 5, 7, 14, 'merged', 'passed', 't5'),
        (6, 1, 5, 7, 14, 'merged', 'failed', 't6');
    INSERT INTO checkpoint_passes VALUES (1, 1, 5, 7, 13, 't4', 't4', 't4');
"""


def test_a_checkpoint_whose_newest_merged_run_passed_without_a_pass_gets_one():
    connection = sqlite3.connect(":memory:", autocommit=True)
    connection.executescript(ROWS)
    WaitingCheckpointsPassedMigration().run(Database.configured(connection))
    assert sorted(row[0] for row in connection.execute("SELECT phase_id FROM checkpoint_passes")) == [10, 13]
