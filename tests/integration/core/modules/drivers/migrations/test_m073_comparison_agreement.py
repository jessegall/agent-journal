import sqlite3

from core.modules.drivers.migrations.m073_comparison_agreement import ComparisonAgreementMigration
from engine.database.database import Database

ROWS = """
    CREATE TABLE driver_comparisons (id INTEGER PRIMARY KEY, old_answer TEXT, new_answer TEXT, difference_state TEXT);
    INSERT INTO driver_comparisons VALUES (1, 'allow', 'allow', 'unexplained');
    INSERT INTO driver_comparisons VALUES (2, 'refuse drivers.block-stop: wait: then stop', 'refuse processes.monitor: wait: then stop', 'unexplained');
    INSERT INTO driver_comparisons VALUES (3, 'refuse tasks.open: take a task', 'allow', 'unexplained');
    INSERT INTO driver_comparisons VALUES (4, 'refuse a.b: one text', 'refuse a.b: another text', 'unexplained');
    INSERT INTO driver_comparisons VALUES (5, 'allow', 'allow', 'intended');
"""


def test_old_comparisons_the_program_saw_alike_are_agreed_and_real_differences_stay():
    connection = sqlite3.connect(":memory:", autocommit=True)
    connection.executescript(ROWS)
    ComparisonAgreementMigration().run(Database.configured(connection))
    states = dict(connection.execute("SELECT id, difference_state FROM driver_comparisons ORDER BY id").fetchall())
    assert states == {1: "agreed", 2: "agreed", 3: "unexplained", 4: "unexplained", 5: "intended"}
