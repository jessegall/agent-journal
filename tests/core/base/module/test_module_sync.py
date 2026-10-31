import json
import os

import pytest

from core.base.container import Container
from core.base.database.database import Database
from core.base.database.statement import Statement
from core.base.journal_home import JournalHome
from core.base.module.code_fingerprint import CodeFingerprint
from core.base.module.module_finder import ModuleFinder
from core.base.module.module_sync import ModuleSync
from core.base.registry.registry import Registry, StaleRegistryError
from tests.core.base.samples import sync_sample

ITEMS = "tests.core.base.samples.sync_sample:ItemsModule"
ITEM_COUNT = "tests.core.base.samples.sync_sample:ItemCountModule"
EVENT = Statement("INSERT INTO events (actor_id, row_id, name, row_table, command, created_at) VALUES (1, 1, 'item.create', 'items', 'ItemMake', '2026')")


def synced(home: JournalHome, *modules: str) -> Container:
    home.module_list.write_text(json.dumps(list(modules)))
    container = Container()
    container.bind(JournalHome, home)
    container.bind(Database, Database.opened(home))
    container.get(ModuleSync).run()
    return container


def test_the_registry_after_a_sync_names_every_noun_handler_guard_and_listener(tmp_path):
    container = synced(JournalHome(tmp_path), ITEMS, ITEM_COUNT)
    database = container.get(Database)
    registry = Registry.read(database)
    assert (registry.models["item"].module, registry.models["item"].model.text) == ("items", "tests.core.base.model.test_model:Item")
    assert {"core.base.command.make_command:MakeCommand", "core.base.command.move_command:MoveCommand"} <= set(registry.handlers)
    assert [guard.name for guard in registry.guards][:2] == ["core.lifecycle", "items.paused-only"]
    module_actor = database.rows(Statement("SELECT id FROM actors WHERE type = 'module' AND name = 'item-count'"))[0]["id"]
    assert [(listener.name, listener.timing.value, listener.actor_id) for listener in registry.listeners if listener.name == "items.paused-count"] == [("items.paused-count", "commit", module_actor)]
    actors = [tuple(row) for row in database.rows(Statement("SELECT id, type, name FROM actors ORDER BY id"))]
    assert actors[0] == (1, "core", "core") and {(actor_type, name) for _, actor_type, name in actors[1:]} >= {("module", "items"), ("module", "item-count")}


def test_a_second_sync_changes_nothing(tmp_path):
    home = JournalHome(tmp_path)
    synced(home, ITEMS, ITEM_COUNT)
    registry_first = Database.opened(home).rows(Statement("SELECT * FROM registry"))[0]
    registry_second = synced(home, ITEMS, ITEM_COUNT).get(Database).rows(Statement("SELECT * FROM registry"))[0]
    assert tuple(registry_first) == tuple(registry_second)


def test_a_changed_module_changes_the_fingerprint_and_the_old_registry_is_refused(tmp_path):
    home = JournalHome(tmp_path)
    database = synced(home, ITEMS).get(Database)
    modules = ModuleFinder(home).modules()
    status = os.stat(sync_sample.__file__)
    os.utime(sync_sample.__file__, ns=(status.st_atime_ns, status.st_mtime_ns + 1_000_000))
    try:
        with pytest.raises(StaleRegistryError):
            Registry.read(database).require_current(CodeFingerprint().text(modules))
    finally:
        os.utime(sync_sample.__file__, ns=(status.st_atime_ns, status.st_mtime_ns))


def test_a_new_commit_listener_starts_at_the_newest_event(tmp_path):
    home = JournalHome(tmp_path)
    database = synced(home, ITEMS).get(Database)
    database.insert(EVENT)
    database.insert(EVENT)
    database = synced(home, ITEMS, ITEM_COUNT).get(Database)
    assert database.rows(Statement("SELECT event_id FROM listener_cursors WHERE listener = 'items.paused-count'"))[0][0] == 2
