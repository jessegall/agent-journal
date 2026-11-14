from engine.time.clock import Clock
from engine.database.core_tables_migration import CORE_MIGRATIONS
from engine.database.database import Database
from engine.database.module_migrations import ModuleMigrations
from engine.database.schema import Schema
from engine.database.statement import Statement
from engine.journal.journal_home import JournalHome
from engine.model.tables import Tables
from core.modules.asks.migrations.m003_ask_setting_keys import AskSettingKeysMigration

SETTINGS_TABLE = "CREATE TABLE settings (id INTEGER PRIMARY KEY, key TEXT NOT NULL, value TEXT NOT NULL, environment_id INTEGER)"
OLD = "journal.suites.coding.workers.ask-answer-minutes"
NEW = "journal.core.asks.ask-answer-minutes"


def migrated(tmp_path, rows) -> Database:
    database = Database.opened(JournalHome(tmp_path))
    Schema(database, Tables(), Clock()).migrate([CORE_MIGRATIONS])
    database.update(Statement(SETTINGS_TABLE))
    for key, value in rows:
        database.update(Statement("INSERT INTO settings (key, value, environment_id) VALUES (?, ?, 5)", [key, value]))
    Schema(database, Tables(), Clock()).migrate([ModuleMigrations("journal.core.asks", [AskSettingKeysMigration()])])
    return database


def stored(database: Database) -> list[tuple[str, str]]:
    return [(row["key"], row["value"]) for row in database.rows(Statement("SELECT key, value FROM settings ORDER BY key"))]


def test_stored_old_key_read_as_new_setting(tmp_path):
    database = migrated(tmp_path, [(OLD, "15")])
    assert stored(database) == [(NEW, "15")]
    database.close()


def test_both_keys_keep_the_new_one(tmp_path):
    database = migrated(tmp_path, [(OLD, "15"), (NEW, "20")])
    assert stored(database) == [(NEW, "20")]
    database.close()
