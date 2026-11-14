import sqlite3

from engine.database.database import Database
from core.modules.processes.migrations.m081_long_lane_capacity import LongLaneCapacityMigration

SETTINGS = ("CREATE TABLE settings (id INTEGER PRIMARY KEY, environment_id INTEGER, creator_id INTEGER NOT NULL, key TEXT NOT NULL, value TEXT NOT NULL,"
            " version INTEGER NOT NULL, metadata TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL)")
STAMP = "2026-11-13T12:00:00+00:00"


def long_capacity(batch_size: str) -> list[str]:
    connection = sqlite3.connect(":memory:", autocommit=True)
    connection.execute(SETTINGS)
    connection.execute("INSERT INTO settings (environment_id, creator_id, key, value, version, metadata, created_at, updated_at) VALUES (5, 1, ?, ?, 1, '{}', ?, ?)",
                       ["journal.core.processes.run-batch-size", batch_size, STAMP, STAMP])
    LongLaneCapacityMigration().run(Database.configured(connection))
    return [row[0] for row in connection.execute("SELECT value FROM settings WHERE key = 'journal.core.processes.lane-capacity-long'")]


def test_batch_size_two_becomes_long_capacity_eight():
    assert long_capacity("2") == ["8"]


def test_batch_size_five_becomes_long_capacity_twenty():
    assert long_capacity("5") == ["20"]
