import sqlite3

from engine.database.database import Database
from engine.enums.execution_priority import ExecutionPriority
from core.modules.processes.migrations.m078_process_execution_priority import ProcessExecutionPriorityMigration


def test_old_text_priorities_become_execution_priorities():
    connection = sqlite3.connect(":memory:", autocommit=True)
    connection.execute("CREATE TABLE processes (id INTEGER PRIMARY KEY, priority TEXT NOT NULL DEFAULT 'normal')")
    connection.executemany("INSERT INTO processes VALUES (?, ?)", [(1, "high"), (2, "normal"), (3, "low")])
    ProcessExecutionPriorityMigration().run(Database.configured(connection))
    stored = connection.execute("SELECT id, priority FROM processes ORDER BY id").fetchall()
    assert [(row[0], ExecutionPriority(row[1])) for row in stored] == [(1, ExecutionPriority.AGENT), (2, ExecutionPriority.NORMAL), (3, ExecutionPriority.BACKGROUND)]
    connection.execute("INSERT INTO processes (id) VALUES (4)")
    assert connection.execute("SELECT priority FROM processes WHERE id = 4").fetchone()[0] == ExecutionPriority.NORMAL
