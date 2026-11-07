import sqlite3

import pytest

from core.base.database.database import Database
from suites.coding.modules.workers.migrations.m010_alias_access import AliasAccessMigration
from suites.coding.modules.workers.migrations.m011_process_owner import ProcessOwnerMigration


@pytest.mark.parametrize("legacy", [False, True])
def test_alias_permissions_survive_old_and_fresh_schemas(legacy):
    connection = sqlite3.connect(":memory:", autocommit=True)
    database = Database.configured(connection)
    try:
        connection.execute("CREATE TABLE aliases (id INTEGER PRIMARY KEY, agent_access INTEGER NOT NULL DEFAULT 0)")
        connection.execute("INSERT INTO aliases (id) VALUES (1)")
        if legacy:
            connection.execute("ALTER TABLE aliases ADD COLUMN worker_access INTEGER NOT NULL DEFAULT 0")
            connection.execute("UPDATE aliases SET worker_access = 1")
        AliasAccessMigration().run(database)
        assert connection.execute("SELECT agent_access FROM aliases").fetchone()[0] == int(legacy)
        assert "worker_access" not in {row[1] for row in connection.execute("PRAGMA table_info(aliases)")}
    finally:
        database.close()


@pytest.mark.parametrize("legacy", [False, True])
def test_process_ownership_and_merge_visibility_survive_old_and_fresh_schemas(legacy):
    connection = sqlite3.connect(":memory:", autocommit=True)
    database = Database.configured(connection)
    try:
        connection.execute("CREATE TABLE processes (id INTEGER PRIMARY KEY, owner_agent_id INTEGER)")
        connection.execute("INSERT INTO processes (id) VALUES (1)")
        connection.execute("CREATE TABLE process_parts (text TEXT NOT NULL, is_visible INTEGER NOT NULL DEFAULT 0)")
        connection.execute("INSERT INTO process_parts (text) VALUES ('journal worker merge 4'), ('Journal worker merge 4'), ('journal worker_merGe 4')")
        if legacy:
            connection.execute("ALTER TABLE processes ADD COLUMN worker_id INTEGER")
            connection.execute("UPDATE processes SET worker_id = 42")
        ProcessOwnerMigration().run(database)
        assert connection.execute("SELECT owner_agent_id FROM processes").fetchone()[0] == (42 if legacy else None)
        assert "worker_id" not in {row[1] for row in connection.execute("PRAGMA table_info(processes)")}
        assert [row[0] for row in connection.execute("SELECT is_visible FROM process_parts ORDER BY rowid")] == [1, 0, 0]
    finally:
        database.close()
