import sqlite3

from suites.coding.modules.workers.migrations.m041_worker_mark_cursors import WorkerMarkCursorMigration


def test_split_listeners_keep_their_previous_pending_positions():
    with sqlite3.connect(":memory:") as database:
        database.execute("CREATE TABLE listener_cursors (listener TEXT PRIMARY KEY, event_id INTEGER NOT NULL)")
        database.execute("INSERT INTO listener_cursors VALUES ('workers.route-mark', 12)")
        database.execute("INSERT INTO listener_cursors VALUES ('workers.task-route-mark', 7)")
        for statement in WorkerMarkCursorMigration.statements:
            database.execute(statement)
        assert database.execute("SELECT event_id FROM listener_cursors WHERE listener = 'workers.split-mark'").fetchone() == tuple([12])
        assert database.execute("SELECT event_id FROM listener_cursors WHERE listener = 'workers.task-tag-route-mark'").fetchone() == tuple([7])
