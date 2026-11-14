from engine.time.clock import Clock
from engine.database.core_tables_migration import CORE_MIGRATIONS
from engine.database.database import Database
from engine.database.module_migrations import ModuleMigrations
from engine.database.schema import Schema
from engine.database.statement import Statement
from engine.journal.journal_home import JournalHome
from engine.model.tables import Tables
import sqlite3

import pytest

from core.modules.asks.migrations.m001_asks import AsksTablesMigration
from core.modules.asks.migrations.m002_ask_stacks import AskStacksTableMigration

TABLES = Statement("SELECT name FROM sqlite_master WHERE type = 'table' AND name IN ('asks', 'ask_steps') ORDER BY name")
INDEXES = Statement("SELECT name FROM sqlite_master WHERE type = 'index' AND tbl_name IN ('asks', 'ask_steps') AND name NOT LIKE 'sqlite_%' ORDER BY name")


def migrated(tmp_path) -> Database:
    database = Database.opened(JournalHome(tmp_path))
    Schema(database, Tables(), Clock()).migrate([CORE_MIGRATIONS])
    Schema(database, Tables(), Clock()).migrate([ModuleMigrations("journal.core.asks", [AsksTablesMigration(), AskStacksTableMigration()])])
    return database


def test_tables_and_indexes_exist(tmp_path):
    database = migrated(tmp_path)
    assert [row["name"] for row in database.rows(TABLES)] == ["ask_steps", "asks"]
    assert [row["name"] for row in database.rows(INDEXES)] == ["ask_steps_ask", "ask_steps_open_due", "ask_steps_profile", "asks_asker", "asks_asker_group", "asks_open"]
    database.close()


def test_retired_asker_row_kept(tmp_path):
    database = migrated(tmp_path)
    foreign_keys = database.rows(Statement("SELECT \"from\", on_delete FROM pragma_foreign_key_list('asks')"))
    assert {row["from"]: row["on_delete"] for row in foreign_keys}["asker_id"] == "RESTRICT"
    database.close()


def test_one_open_stack_per_topic_index(tmp_path):
    database = migrated(tmp_path)
    # the environments and actors tables belong to other modules, which this test does not migrate
    database.update(Statement("PRAGMA foreign_keys = OFF"))
    insert = "INSERT INTO ask_stacks (environment_id, creator_id, topic, needs_approval, created_at, updated_at) VALUES (1, 1, 'general', {waiting}, '2026-11-14', '2026-11-14')"
    database.update(Statement(insert.format(waiting=0)))
    database.update(Statement(insert.format(waiting=1)))
    with pytest.raises(sqlite3.IntegrityError):
        database.update(Statement(insert.format(waiting=0)))
    database.close()
