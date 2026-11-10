import sqlite3

from core.base.database.database import Database
from engine.journal.journal_home import JournalHome
from core.modules.plugins.migrations.m001_plugins import ROW_COLUMNS
from core.modules.plugins.migrations.m005_plugin_event_deliveries import PluginEventDeliveriesMigration

OLD_TABLES = (
    "CREATE TABLE plugins (id INTEGER PRIMARY KEY)",
    "CREATE TABLE environments (id INTEGER PRIMARY KEY)",
    "CREATE TABLE agents (id INTEGER PRIMARY KEY)",
    "CREATE TABLE actors (id INTEGER PRIMARY KEY)",
    f"CREATE TABLE plugin_deliveries (id INTEGER PRIMARY KEY, plugin_id INTEGER NOT NULL REFERENCES plugins(id), environment_id INTEGER NOT NULL REFERENCES environments(id), session_agent_id INTEGER NOT NULL REFERENCES agents(id), creator_id INTEGER NOT NULL REFERENCES actors(id), event TEXT NOT NULL, data TEXT NOT NULL, {ROW_COLUMNS}) STRICT",
    f"CREATE TABLE plugin_outputs (id INTEGER PRIMARY KEY, plugin_id INTEGER NOT NULL REFERENCES plugins(id), environment_id INTEGER NOT NULL REFERENCES environments(id), session_agent_id INTEGER NOT NULL REFERENCES agents(id), creator_id INTEGER NOT NULL REFERENCES actors(id), output TEXT NOT NULL, {ROW_COLUMNS}) STRICT",
    "CREATE INDEX plugin_outputs_plugin ON plugin_outputs (plugin_id)",
    "INSERT INTO plugins VALUES (1)", "INSERT INTO environments VALUES (2)", "INSERT INTO agents VALUES (3)", "INSERT INTO actors VALUES (4)",
    "INSERT INTO plugin_deliveries (id, plugin_id, environment_id, session_agent_id, creator_id, event, data, created_at, updated_at) VALUES (7, 1, 2, 3, 4, 'file_edited', '{}', 'then', 'then')",
    "INSERT INTO plugin_outputs (id, plugin_id, environment_id, session_agent_id, creator_id, output, created_at, updated_at) VALUES (8, 1, 2, 3, 4, '{}', 'then', 'then')",
)


def migrated(tmp_path) -> sqlite3.Connection:
    home = JournalHome(tmp_path / "journal")
    home.folder.mkdir()
    connection = sqlite3.connect(home.database)
    connection.executescript(";".join(OLD_TABLES))
    connection.close()
    database = Database.opened(home)
    PluginEventDeliveriesMigration().run(database)
    database.close()
    return sqlite3.connect(home.database)


def test_every_row_is_kept_and_the_index_is_there(tmp_path):
    connection = migrated(tmp_path)
    delivery = connection.execute("SELECT id, plugin_id, environment_id, session_agent_id, event, script, event_id FROM plugin_deliveries").fetchall()
    assert delivery == [(7, 1, 2, 3, "file_edited", "", None)]
    assert connection.execute("SELECT id, environment_id, session_agent_id FROM plugin_outputs").fetchall() == [(8, 2, 3)]
    assert connection.execute("SELECT name FROM sqlite_master WHERE type = 'index' AND name = 'plugin_outputs_plugin'").fetchall() == [tuple(["plugin_outputs_plugin"])]


def test_a_row_may_have_no_agent_and_no_environment(tmp_path):
    connection = migrated(tmp_path)
    connection.execute("INSERT INTO plugin_deliveries (plugin_id, creator_id, event, data, script, event_id, created_at, updated_at) VALUES (1, 4, 'journal.booting', '{}', 'see.sh', 9, 'now', 'now')")
    connection.execute("INSERT INTO plugin_outputs (plugin_id, creator_id, output, created_at, updated_at) VALUES (1, 4, '{}', 'now', 'now')")
    assert connection.execute("SELECT environment_id, session_agent_id, script, event_id FROM plugin_deliveries WHERE id != 7").fetchall() == [(None, None, "see.sh", 9)]
