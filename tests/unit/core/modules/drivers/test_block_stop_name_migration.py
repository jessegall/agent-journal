import sqlite3

from core.modules.drivers.migrations.m020_block_stop_name import BlockStopNameMigration


def test_renaming_the_stop_flag_preserves_existing_blocks():
    with sqlite3.connect(":memory:") as connection:
        connection.execute("CREATE TABLE agent_blocks (id INTEGER PRIMARY KEY, stop_only INTEGER NOT NULL DEFAULT 0)")
        connection.executemany("INSERT INTO agent_blocks (id, stop_only) VALUES (?, ?)", [(1, 0), (2, 1)])
        for statement in BlockStopNameMigration.statements:
            connection.execute(statement)
        assert connection.execute("SELECT id, blocks_stop FROM agent_blocks ORDER BY id").fetchall() == [(1, 0), (2, 1)]
        connection.execute("INSERT INTO agent_blocks (id) VALUES (3)")
        [blocks_stop] = connection.execute("SELECT blocks_stop FROM agent_blocks WHERE id = 3").fetchone()
        assert blocks_stop == 0
