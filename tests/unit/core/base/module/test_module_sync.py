import json

import pytest

from engine.container.container import Container
from core.base.database.database import Database
from core.base.database.listener_cursor_table import ListenerCursorTable
from core.base.database.statement import Statement
from engine.journal.journal import Journal
from engine.journal.journal_home import JournalHome
from core.base.module.code_fingerprint import CodeFingerprint
from core.base.module.module_finder import ModuleFinder
from core.base.module.module_sync import ModuleSync
from core.base.registry.registry import Registry
from core.base.registry.stale_registry_error import StaleRegistryError
from core.base.registry.template_entry import TemplateEntry
from engine.template.template_declaration import TemplateDeclaration

from tests.unit.core.base.samples.module_copy import items_module_copy
from tests.unit.core.base.samples.sync_sample import ItemsModule

ITEMS = "tests.unit.core.base.samples.sync_sample:ItemsModule"
ITEM_COUNT = "tests.unit.core.base.samples.sync_sample:ItemCountModule"
EVENT = Statement("INSERT INTO events (actor_id, row_id, name, row_table, command, created_at) VALUES (1, 1, 'item.create', 'items', 'MakeItem', '2026')")


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
    assert (registry.models["item"].module, registry.models["item"].model.text) == ("items", "tests.unit.engine.model.test_model:Item")
    assert {"engine.command.make_command:MakeCommand", "engine.command.move_command:MoveCommand"} <= set(registry.handlers)
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


def test_a_sync_keeps_module_template_entries(tmp_path, monkeypatch):
    declaration = TemplateDeclaration(title="Review items", targets=tuple(["item"]), parts=tuple(["Problems"]))
    monkeypatch.setattr(ItemsModule, "templates", [declaration])
    container = synced(JournalHome(tmp_path), ITEMS)
    entries = Registry.read(container.get(Database)).templates
    assert tuple(entry for entry in entries if entry.module == "items") == tuple([TemplateEntry("items", declaration)])


def test_a_changed_module_changes_the_fingerprint_and_the_old_registry_is_refused(tmp_path, monkeypatch):
    monkeypatch.setattr(Journal, "is_running_unit_tests", lambda: False)
    module_path, copy = items_module_copy(tmp_path, monkeypatch)
    home = JournalHome(tmp_path)
    database = synced(home, module_path).get(Database)
    modules = ModuleFinder(home).modules()
    copy.write_text(copy.read_text() + "\nCHANGED_CONTENT = True\n")
    with pytest.raises(StaleRegistryError):
        Registry.read(database).require_current(CodeFingerprint().text(modules))


def test_a_new_commit_listener_starts_at_the_newest_event(tmp_path):
    home = JournalHome(tmp_path)
    database = synced(home, ITEMS).get(Database)
    database.insert(EVENT)
    database.insert(EVENT)
    database = synced(home, ITEMS, ITEM_COUNT).get(Database)
    newest = database.rows(Statement("SELECT max(id) FROM events"))[0][0]
    assert database.rows(Statement("SELECT event_id FROM listener_cursors WHERE listener = 'items.paused-count'"))[0][0] == newest


def test_sync_removes_a_stale_cursor_so_caught_up_listeners_have_no_unhandled_events(tmp_path):
    container = synced(JournalHome(tmp_path), ITEMS, ITEM_COUNT)
    database = container.get(Database)
    cursors = container.get(ListenerCursorTable)
    cursors.start("items.removed")
    database.insert(EVENT)
    assert cursors.has_unhandled_events()

    container.get(ModuleSync).run()
    newest = database.rows(Statement("SELECT max(id) FROM events"))[0][0]
    cursors.advance_all(tuple(cursors.positions().keys() - {"items.removed"}), newest)

    assert not cursors.has_unhandled_events()
