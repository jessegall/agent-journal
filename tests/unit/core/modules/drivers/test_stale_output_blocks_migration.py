import sqlite3

from core.modules.processes.migrations.m083_stale_output_blocks import StaleOutputBlocksMigration


def test_open_blocks_of_ended_or_gone_runs_and_read_outputs_close_and_the_others_stay_open():
    with sqlite3.connect(":memory:") as connection:
        connection.execute("CREATE TABLE agent_blocks (id INTEGER PRIMARY KEY, condition_name TEXT, condition_text TEXT, closed_at TEXT)")
        connection.execute("CREATE TABLE processes (id INTEGER PRIMARY KEY, state TEXT)")
        connection.execute("CREATE TABLE outputs (id INTEGER PRIMARY KEY, process_id INTEGER, read_at TEXT)")
        connection.executemany("INSERT INTO processes (id, state) VALUES (?, ?)", [(10, "running"), (11, "finished"), (13, "background")])
        connection.executemany("INSERT INTO outputs (process_id, read_at) VALUES (?, ?)", [(10, None), (11, "2026-11-14T00:00:00.000000+00:00"), (13, None)])
        connection.executemany("INSERT INTO agent_blocks (id, condition_name, condition_text) VALUES (?, 'ran-command', ?)", [
            (1, "journal output title 10"), (2, "journal output title 11"), (3, "journal output title 12"),
            (4, "journal output read 13 --tail 5"), (5, "journal output read 11 --tail 5"), (6, "journal output read 12 --tail 5"), (7, "journal overview")])
        for statement in StaleOutputBlocksMigration.statements:
            connection.execute(statement)
        open_ids = [row[0] for row in connection.execute("SELECT id FROM agent_blocks WHERE closed_at IS NULL ORDER BY id")]
        assert open_ids == [1, 4, 7]
