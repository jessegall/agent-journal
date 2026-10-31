import json

import pytest

from core.base.database.database import Database
from core.base.database.statement import Statement
from core.base.journal_home import JournalHome
from core.base.module.module_error import ModuleError
from core.base.module.module_removal import ModuleRemoval
from tests.core.base.module.test_module_sync import ITEM_COUNT, ITEMS, synced

REMOVABLE_ITEMS = "tests.core.base.samples.sync_sample:RemovableItemsModule"
ITEM = Statement("INSERT INTO items (title, state, version, created_at, updated_at) VALUES ('Dune', 'open', 1, '2026', '2026')")
TABLES = Statement("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'items'")


def test_a_module_whose_tables_hold_rows_is_refused(tmp_path):
    container = synced(JournalHome(tmp_path), ITEMS)
    container.get(Database).insert(ITEM)
    with pytest.raises(ModuleError, match="items still has 1 rows in items"):
        container.get(ModuleRemoval).remove("items")


def test_a_module_with_a_removal_migration_is_removed_with_its_rows(tmp_path):
    home = JournalHome(tmp_path)
    container = synced(home, REMOVABLE_ITEMS)
    database = container.get(Database)
    database.insert(ITEM)
    container.get(ModuleRemoval).remove("items")
    assert database.rows(TABLES) == []
    assert database.rows(Statement("SELECT * FROM migrations WHERE module = 'items'")) == []
    assert json.loads(home.module_list.read_text()) == []


def test_a_removed_module_takes_its_listener_cursors_with_it(tmp_path):
    container = synced(JournalHome(tmp_path), ITEMS, ITEM_COUNT)
    container.get(ModuleRemoval).remove("item-count")
    assert container.get(Database).rows(Statement("SELECT * FROM listener_cursors WHERE listener = 'items.paused-count'")) == []


def test_a_default_or_unknown_module_cannot_be_removed(tmp_path):
    container = synced(JournalHome(tmp_path), ITEMS)
    with pytest.raises(ModuleError, match="no installed plugin"):
        container.get(ModuleRemoval).remove("tasks")
