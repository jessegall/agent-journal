import json
import sys

import pytest

from core.base.database.core_tables_migration import CORE_MIGRATIONS
from core.base.database.database import Database
from core.base.database.schema import Schema
from core.base.database.statement import Statement
from core.base.journal_home import JournalHome
from core.base.model.tables import Tables
from core.base.registry.dotted_path import DottedPath
from core.base.registry.dotted_path_error import DottedPathError
from core.base.registry.listener_timing import ListenerTiming
from core.base.registry.registry import Registry
from core.base.registry.stale_registry_error import StaleRegistryError
from tests.unit.core.base.command.test_commands import ItemMake

SAMPLE = "tests.unit.core.base.samples.registry_sample:SampleGuard"
ENTRIES = {
    "models": {"item": {"module": "items", "model": "tests.unit.core.base.model.test_model:Item", "commands": [], "excluded_subcommands": []}},
    "handlers": {DottedPath.class_path(ItemMake).text: "tests.unit.core.base.command.test_commands:ItemMake"},
    "subcommands": {"item make": "tests.unit.core.base.command.test_commands:ItemMake"},
    "guards": [
        {"name": "items.no-second-item", "event": "item.create", "path": SAMPLE, "position": 2, "short_flag": ""},
        {"name": "core.lifecycle", "event": "*", "path": SAMPLE, "position": 1, "short_flag": ""},
        {"name": "items.only-shelved", "event": "shelf.*", "path": SAMPLE, "position": 3, "short_flag": "confirm"},
    ],
    "bindings": {},
    "listeners": [
        {"name": "items.tell-the-reader", "event": "item.*", "timing": "commit", "path": SAMPLE, "position": 1, "actor_id": 3},
        {"name": "items.count-items", "event": "item.create", "timing": "save", "path": SAMPLE, "position": 2, "actor_id": 3},
    ],
}


@pytest.fixture
def database(tmp_path):
    opened = Database.opened(JournalHome(tmp_path))
    Schema(opened, Tables()).migrate([CORE_MIGRATIONS])
    opened.insert(Statement("INSERT INTO registry (id, fingerprint, entries, synced_at) VALUES (1, 'abc', ?, '2026-10-31')", [json.dumps(ENTRIES)]))
    yield opened
    opened.close()


def test_the_guards_of_an_event_come_in_their_order(database):
    registry = Registry.read(database)
    assert [guard.name for guard in registry.event_guards("item.create")] == ["core.lifecycle", "items.no-second-item"]
    assert [guard.name for guard in registry.event_guards("shelf.update")] == ["core.lifecycle", "items.only-shelved"]


def test_a_guard_is_skipped_by_its_short_flag_or_by_name(database):
    guards = {guard.name: guard for guard in Registry.read(database).guards}
    assert guards["items.only-shelved"].skip_flag == "--confirm"
    assert guards["items.no-second-item"].skip_flag == "--skip-guard items.no-second-item"


def test_listeners_are_listed_by_event_and_timing(database):
    registry = Registry.read(database)
    assert [listener.name for listener in registry.event_listeners("item.create", ListenerTiming.COMMIT)] == ["items.tell-the-reader"]
    assert [listener.name for listener in registry.event_listeners("item.create", ListenerTiming.SAVE)] == ["items.count-items"]


def test_a_command_finds_its_handler(database):
    registry = Registry.read(database)
    assert registry.has_handler(ItemMake) and registry.command_handler(ItemMake).loaded() is ItemMake


def test_a_registry_built_from_other_code_is_refused(database):
    registry = Registry.read(database)
    registry.require_current("abc")
    with pytest.raises(StaleRegistryError, match="journal module sync"):
        registry.require_current("def")


def test_a_journal_never_synced_is_told_to_sync(tmp_path):
    database = Database.opened(JournalHome(tmp_path))
    Schema(database, Tables()).migrate([CORE_MIGRATIONS])
    with pytest.raises(StaleRegistryError, match="never been synced"):
        Registry.read(database)


def test_a_class_named_by_its_path_is_imported_only_when_asked_for(database):
    sys.modules.pop("tests.unit.core.base.samples.registry_sample", None)
    Registry.read(database)
    assert "tests.unit.core.base.samples.registry_sample" not in sys.modules
    assert DottedPath(SAMPLE).loaded().__name__ == "SampleGuard"
    with pytest.raises(DottedPathError):
        DottedPath("tests.unit.core.base.samples.registry_sample:Nothing").loaded()
