from core.base.clock import Clock
from core.base.database.core_tables_migration import CORE_MIGRATIONS
from core.base.database.database import Database
from core.base.database.module_migrations import ModuleMigrations
from core.base.database.schema import Schema
from core.base.database.statement import Statement
from core.base.journal_home import JournalHome
from core.base.model.tables import Tables
from core.modules.pins.migrations.m001_pins import PinsTableMigration

OLD_TABLE = (
    "CREATE TABLE notices (id INTEGER PRIMARY KEY, environment_id INTEGER NOT NULL,"
    " creator_id INTEGER NOT NULL, title TEXT NOT NULL CHECK (length(title) BETWEEN 1 AND 80), link TEXT NOT NULL,"
    " label TEXT NOT NULL DEFAULT 'Open', closed_at TEXT, version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
    " created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT"
)
TABLES = Statement("SELECT name FROM sqlite_master WHERE type = 'table' AND name IN ('notices', 'pins') ORDER BY name")
INDEXES = Statement("SELECT name FROM sqlite_master WHERE type = 'index' AND name LIKE '%environment' AND tbl_name IN ('notices', 'pins') ORDER BY name")


def opened(tmp_path) -> Database:
    database = Database.opened(JournalHome(tmp_path))
    Schema(database, Tables(), Clock()).migrate([CORE_MIGRATIONS])
    return database


def test_a_database_with_a_table_of_notices_keeps_its_rows_as_pins(tmp_path):
    database = opened(tmp_path)
    database.update(Statement(OLD_TABLE))
    database.update(Statement("CREATE INDEX notices_environment ON notices (environment_id, closed_at)"))
    database.update(Statement("INSERT INTO notices (id, environment_id, creator_id, title, link, label, created_at, updated_at) VALUES (7, 1, 1, 'Build is red', 'https://ci.example.org/7', 'Open', '2026-11-01', '2026-11-01')"))
    Schema(database, Tables(), Clock()).migrate([ModuleMigrations("journal.core.pins", [PinsTableMigration()])])
    rows = database.rows(Statement("SELECT id, title, link FROM pins"))
    assert [(row["id"], row["title"], row["link"]) for row in rows] == [(7, "Build is red", "https://ci.example.org/7")]
    assert [row["name"] for row in database.rows(TABLES)] == ["pins"]
    assert [row["name"] for row in database.rows(INDEXES)] == ["pins_environment"]
    database.close()


def test_a_new_database_gets_an_empty_pins_table(tmp_path):
    database = opened(tmp_path)
    Schema(database, Tables(), Clock()).migrate([ModuleMigrations("journal.core.pins", [PinsTableMigration()])])
    assert [row["name"] for row in database.rows(TABLES)] == ["pins"]
    assert database.rows(Statement("SELECT count(*) AS total FROM pins"))[0]["total"] == 0
    database.close()
