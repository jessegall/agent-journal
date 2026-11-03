import sqlite3

from core.modules.processes.migrations.m027_reader_request_chat_history import ReaderRequestChatHistoryMigration


def test_existing_reader_request_marks_leave_chat_and_command_marks_remain():
    with sqlite3.connect(":memory:") as connection:
        connection.execute("CREATE TABLE chat_marks (id INTEGER PRIMARY KEY, type TEXT)")
        connection.executemany("INSERT INTO chat_marks (id, type) VALUES (?, ?)", [(1, "processes.reader_request"), (2, "processes.command")])
        for statement in ReaderRequestChatHistoryMigration.statements:
            connection.execute(statement)
        assert [row[0] for row in connection.execute("SELECT id FROM chat_marks")] == [2]
