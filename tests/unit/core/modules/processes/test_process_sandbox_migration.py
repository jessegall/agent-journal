import sqlite3

import pytest

from engine.database.database import Database
from core.modules.processes.migrations.m048_process_sandbox import ProcessSandboxMigration


@pytest.mark.parametrize("existing", [False, True])
def test_the_sandbox_column_is_added_or_kept_without_losing_recorded_levels(existing):
    connection = sqlite3.connect(":memory:", autocommit=True)
    connection.execute("CREATE TABLE processes (id INTEGER PRIMARY KEY)")
    if existing:
        connection.execute("ALTER TABLE processes ADD COLUMN sandbox_level TEXT NOT NULL DEFAULT 'none'")
        connection.execute("INSERT INTO processes VALUES (1, 'macos')")
    else:
        connection.execute("INSERT INTO processes VALUES (1)")
    ProcessSandboxMigration().run(Database.configured(connection))
    assert connection.execute("SELECT sandbox_level FROM processes WHERE id = 1").fetchone()[0] == ("macos" if existing else "none")
