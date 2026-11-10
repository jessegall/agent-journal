from engine.time.clock import Clock
import json
import sqlite3
import sys

import pytest

from engine.database.core_tables_migration import CORE_MIGRATIONS
from engine.database.database import Database
from engine.database.schema import Schema
from engine.database.statement import Statement
from engine.journal.journal_home import JournalHome
from engine.model.tables import Tables
from engine.dotted_path.dotted_path import DottedPath
from engine.dotted_path.dotted_path_error import DottedPathError
from engine.database.registry_table import RegistryTable
from engine.model.event_form import EventForm
from core.base.registry.event_key_entry import EventKeyEntry
from core.base.registry.listener_timing import ListenerTiming
from core.base.registry.registry import Registry
from core.base.registry.stale_registry_error import StaleRegistryError
from core.base.profile.agent_profile import AgentProfile
from engine.enums.access import Access
from core.base.registry.profile_entry import ProfileEntry
from core.base.registry.suite_entry import SuiteEntry
from engine.template.template_declaration import TemplateDeclaration
from core.base.registry.template_entry import TemplateEntry
from core.base.registry.button_entry import ButtonEntry
from core.base.viewer.button_declaration import AgentField, ButtonCondition, ButtonDeclaration, ButtonMenuItem, Choice, ChoiceField, TemplateField, TextField
from engine.agent.agent_policy import AgentPolicy
from core.base.registry.window_entry import WindowEntry
from dataclasses import replace
from tests.unit.engine.command.test_commands import MakeItem

SAMPLE = "tests.unit.core.base.samples.registry_sample:SampleGuard"
ENTRIES = {
    "models": {"item": {"module": "items", "model": "tests.unit.engine.model.test_model:Item", "commands": [], "excluded_subcommands": []}},
    "handlers": {DottedPath.class_path(MakeItem).text: "tests.unit.engine.command.test_commands:MakeItem"},
    "subcommands": {"item make": "tests.unit.engine.command.test_commands:MakeItem"},
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
    Schema(opened, Tables(), Clock()).migrate([CORE_MIGRATIONS])
    opened.insert(Statement("INSERT INTO registry (id, fingerprint, entries, synced_at) VALUES (1, 'abc', ?, '2026-10-31')", [json.dumps(ENTRIES)]))
    yield opened
    opened.close()


def test_the_guards_of_an_event_come_in_their_order(database):
    registry = Registry.read(database)
    assert [guard.name for guard in registry.event_guards("item.create")] == ["core.lifecycle", "items.no-second-item"]
    assert [guard.name for guard in registry.event_guards("shelf.update")] == ["core.lifecycle", "items.only-shelved"]


def test_a_guard_is_skipped_by_its_short_flag_or_by_name(database):
    guards = {guard.name: guard for guard in Registry.read(database).guards}
    assert guards["items.only-shelved"].skip_flag == "--confirm --skip-reason '<why it is wrong here>'"
    assert guards["items.no-second-item"].skip_flag == "--skip-guard items.no-second-item --skip-reason '<why it is wrong here>'"


def test_listeners_are_listed_by_event_and_timing(database):
    registry = Registry.read(database)
    assert [listener.name for listener in registry.event_listeners("item.create", ListenerTiming.COMMIT)] == ["items.tell-the-reader"]
    assert [listener.name for listener in registry.event_listeners("item.create", ListenerTiming.SAVE)] == ["items.count-items"]


def test_a_command_finds_its_handler(database):
    registry = Registry.read(database)
    assert registry.has_handler(MakeItem) and registry.command_handler(MakeItem).loaded() is MakeItem


def keyed_registry() -> Registry:
    entry = EventKeyEntry.built("journal.suites.coding.workers", "worker_worktree.cut", tuple(EventForm))
    return replace(Registry.parsed("abc", json.dumps(ENTRIES)), event_keys={entry.event: entry},
                   former_event_keys={"suites.coding.workers.worktree.cut": "suites.coding.workers.tree.cut", "suites.coding.workers.tree.cut": entry.key,
                                      "one.loop": "other.loop", "other.loop": "one.loop"})


def test_the_key_of_a_log_name_is_found_and_an_event_with_no_key_gives_an_empty_text():
    assert keyed_registry().event_key("worker_worktree.cut") == "suites.coding.workers.worker_worktree.cut"
    assert keyed_registry().event_key("plugin_delivery.create") == ""


def test_the_log_name_of_a_key_is_found_through_its_former_keys():
    registry = keyed_registry()
    assert registry.event_name("suites.coding.workers.worker_worktree.cut") == "worker_worktree.cut"
    assert registry.event_name("suites.coding.workers.worktree.cut") == "worker_worktree.cut"
    assert registry.event_name("core.tasks.task.closed") == ""


def test_former_keys_that_lead_to_each_other_end_with_no_event():
    assert keyed_registry().event_name("one.loop") == ""


def test_event_keys_survive_being_written_and_read():
    registry = keyed_registry()
    restored = Registry.parsed(registry.fingerprint, registry.entries_text())
    assert restored.event_keys == registry.event_keys and restored.former_event_keys == registry.former_event_keys


def test_a_registry_built_from_other_code_is_refused(database):
    registry = Registry.read(database)
    registry.require_current("abc")
    with pytest.raises(StaleRegistryError, match="journal module sync"):
        registry.require_current("def")


def test_a_second_read_of_the_same_row_parses_nothing_and_a_sync_is_seen_at_once(database):
    first = Registry.read(database)
    assert Registry.read(database) is first
    RegistryTable(database).write("newer code", first.entries_text(), "2026-11-03T22:00:00+00:00")
    changed = Registry.read(database)
    assert changed is not first and changed.fingerprint == "newer code"


def test_changed_entries_with_the_same_fingerprint_are_read_after_sync(database):
    first = Registry.read(database)
    changed_entries = replace(first, listeners=tuple(replace(listener, actor_id=77) for listener in first.listeners))
    RegistryTable(database).write(first.fingerprint, changed_entries.entries_text(), "2026-11-05T13:00:00+00:00")
    changed = Registry.read(database)
    assert changed is not first
    assert {listener.actor_id for listener in changed.listeners} == {77}


def test_two_databases_share_a_registry_while_their_rows_match_and_keep_listener_actor_ids_separate_after(database, tmp_path):
    first = Registry.read(database)
    second_database = Database.opened(JournalHome(tmp_path / "second"))
    try:
        database.connection.backup(second_database.connection)
        copied = Registry.read(second_database)
        assert copied is first
        changed_entries = replace(first, listeners=tuple(replace(listener, actor_id=88) for listener in first.listeners))
        RegistryTable(second_database).write(first.fingerprint, changed_entries.entries_text(), "2026-11-05T13:00:00+00:00")
        first_entries = replace(first, listeners=tuple(replace(listener, actor_id=99) for listener in first.listeners))
        RegistryTable(database).write(first.fingerprint, first_entries.entries_text(), "2026-11-05T13:00:00+00:00")
        assert {listener.actor_id for listener in Registry.read(second_database).listeners} == {88}
        assert {listener.actor_id for listener in Registry.read(database).listeners} == {99}
    finally:
        second_database.close()


def test_an_in_memory_copy_shares_the_registry_of_its_rows(database):
    first = Registry.read(database)
    memory = Database.configured(sqlite3.connect(":memory:", autocommit=True))
    try:
        database.connection.backup(memory.connection)
        copied = Registry.read(memory)
        assert copied is first
        assert Registry.read(memory) is copied
    finally:
        memory.close()


def test_a_journal_never_synced_is_told_to_sync(tmp_path):
    database = Database.opened(JournalHome(tmp_path))
    Schema(database, Tables(), Clock()).migrate([CORE_MIGRATIONS])
    with pytest.raises(StaleRegistryError, match="never been synced"):
        Registry.read(database)


def test_a_class_named_by_its_path_is_imported_only_when_asked_for(database):
    sys.modules.pop("tests.unit.core.base.samples.registry_sample", None)
    Registry.read(database)
    assert "tests.unit.core.base.samples.registry_sample" not in sys.modules
    assert DottedPath(SAMPLE).loaded().__name__ == "SampleGuard"
    with pytest.raises(DottedPathError):
        DottedPath("tests.unit.core.base.samples.registry_sample:Nothing").loaded()


def test_a_window_and_a_suite_saved_before_icons_options_counts_and_presets_read_with_their_defaults(tmp_path):
    opened = Database.opened(JournalHome(tmp_path))
    Schema(opened, Tables(), Clock()).migrate([CORE_MIGRATIONS])
    window = {"name": "notes.board", "module": "notes", "title": "Board", "entry": "board.html", "loading": "frame", "place": "environment", "roles": [],
              "reads": [], "runs": [], "events": [], "shipped": False, "unavailable_reason": ""}
    suite = {"name": "notes", "module": "notes", "requires": [], "defaults": {}, "complete_control": False, "included_overlays": [], "windows": ["notes.board"]}
    entries = {**ENTRIES, "windows": [window], "suites": [suite]}
    opened.insert(Statement("INSERT INTO registry (id, fingerprint, entries, synced_at) VALUES (1, 'abc', ?, '2026-10-31')", [json.dumps(entries)]))
    registry = Registry.read(opened)
    opened.close()
    read_window = registry.windows[0]
    assert (read_window.icon, read_window.float_width, read_window.float_height, read_window.options, read_window.count, registry.suites[0].presets) == (
        "window", 400, 340, (), "", {})
    assert registry.suites[0].shipped is False


def test_windows_saved_with_the_old_places_read_as_a_pane_and_whose_work_they_show(tmp_path):
    opened = Database.opened(JournalHome(tmp_path))
    Schema(opened, Tables(), Clock()).migrate([CORE_MIGRATIONS])
    base = {"module": "notes", "title": "Board", "entry": "board.html", "loading": "frame", "roles": [], "reads": [], "runs": [], "events": [], "shipped": False, "unavailable_reason": ""}
    windows = [{**base, "name": "notes.board", "place": "environment"}, {**base, "name": "notes.mine", "place": "agent"}, {**base, "name": "notes.menu", "place": "dropdown"}]
    opened.insert(Statement("INSERT INTO registry (id, fingerprint, entries, synced_at) VALUES (1, 'abc', ?, '2026-10-31')", [json.dumps({**ENTRIES, "windows": windows})]))
    registry = Registry.read(opened)
    opened.close()
    assert [(window.place, window.shows) for window in registry.windows] == [("pane", "environment"), ("pane", "one-agent"), ("dropdown", "environment")]


def test_registered_profiles_restore(database):
    profile = AgentProfile("notes-reader", "Reads notes", "Read the notes.", agent_type="reader", model="small", codex_model="small",
                           access=Access.READ, program="codex", independent=True, mcp_tools=tuple(["mcp__notes__read"]),
                           changed=tuple(["model"]), module_text_changed=True)
    policy = AgentPolicy(private_output_roles=tuple(["reader"]), queued_run_roles=tuple(["reader"]))
    suite = SuiteEntry("notes", "notes", (), {}, False, (), (), {}, {}, policy, shipped=True)
    entry = ProfileEntry.declared("notes", profile)
    registry = replace(Registry.read(database), suites=tuple([suite]), profiles=tuple([entry]))
    restored = Registry.parsed("profiles", registry.entries_text())
    assert restored.profile("notes-reader") == entry
    assert restored.profile("notes-reader").profile.access is Access.READ
    assert restored.profile("notes-reader").profile.is_builtin
    assert restored.suites[0].agent_policy == policy
    assert restored.suites[0].shipped is True


def test_window_sources_links_and_components_survive_registry_storage(database):
    window = WindowEntry("notes.board", "notes", "Notes", "board.js", "component", "pane", (), (), (), (), False, "", "window", 400, 340, (), "",
                         sources=[{"key": "progress", "read": "note list", "events": ["note.*"]}], links={"notes": "notes.board"},
                         tabs=[{"key": "notes", "label": "Notes", "read": "note list", "count_field": "", "component": "/modules/notes/agent-notes.js"}])
    registry = replace(Registry.read(database), windows=tuple([window]))
    restored = Registry.parsed("windows", registry.entries_text()).windows[0]
    assert restored.sources == tuple(window.sources)
    assert restored.links == window.links
    assert restored.tabs == tuple(window.tabs)
    assert restored.listing("current").sources == restored.sources
    assert restored.listing("current").links == restored.links


def test_module_templates_survive_registry_storage(database):
    declaration = TemplateDeclaration(title="Review notes", brief="Read the notes.", targets=("item", "worker"),
                                      purpose="critique", parts=("Problems", "Changes"), commands=tuple(["journal item list"]))
    entry = TemplateEntry("acme.review", declaration)
    registry = replace(Registry.read(database), templates=tuple([entry]))
    restored = Registry.parsed("module-templates", registry.entries_text())
    assert restored.templates == tuple([entry])
    assert isinstance(restored.templates[0].declaration.targets, tuple)
    assert isinstance(restored.templates[0].declaration.parts, tuple)
    assert isinstance(restored.templates[0].declaration.commands, tuple)


def test_a_registry_saved_before_module_templates_has_no_entries(database):
    assert Registry.read(database).templates == ()


def test_module_suites_survive_registry_storage(database):
    memberships = {"acme.suite": ("acme", "coding"), "acme.review": tuple(["coding"]), "core": ()}
    registry = replace(Registry.read(database), module_suites=memberships)
    assert Registry.parsed("module-suites", registry.entries_text()).module_suites == memberships


def test_a_registry_saved_before_module_suites_has_no_memberships(database):
    assert Registry.read(database).module_suites == {}


def test_a_button_with_fields_menu_and_labels_survives_registry_storage(database):
    size = ChoiceField("size", "Size", (Choice("short", "Short"), Choice("full", "Full")), "short")
    template = TemplateField("template", "Template", "item", "critique", "General critique")
    message = TextField("message", "Message")
    agent = AgentField("agent", "Agent")
    menu = ButtonMenuItem("Review with a message", "item pause {row_id} --message={message}",
                          fields=tuple([message]), description="Send a message with the review")
    declaration = ButtonDeclaration("notes.review", ("row.item", "notes.toolbar"), "Review", "item pause {row_id}",
                                    icon="check", primary=True, fields=(size, template, message, agent),
                                    condition=ButtonCondition("state", tuple(["open"])), menu=tuple([menu]),
                                    menu_label="More review actions", tip="Review this item")
    entry = ButtonEntry("notes", declaration, True)
    registry = replace(Registry.read(database), buttons=tuple([entry]), button_slots=("row.item", "notes.toolbar"))
    restored = Registry.parsed("buttons", registry.entries_text())
    assert restored.buttons == tuple([entry])
    assert restored.button_slots == registry.button_slots


def test_a_registry_saved_before_declared_buttons_has_none(database):
    registry = Registry.read(database)
    assert registry.buttons == ()
    assert registry.button_slots == ()
