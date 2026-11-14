import json

from engine.registry.registry import Registry
from engine.testing.expectations.expect_row import expect_row
from tests.stories.core.modules.viewer.support import section_modules
from tests.stories.fixtures.third_party import viewer_body

NOTES_READ = {"window": "plan_notes.notes", "line": ["plan", "show", "1"], "environment": "main"}


def listed_windows(server, cookie) -> list[dict]:
    return json.loads(viewer_body(server, "/api/windows?environment=main", cookie))["windows"]


def listed_section(server, cookie, name: str) -> dict:
    return next(window for window in listed_windows(server, cookie) if window["name"] == name)


def allow(server, cookie, window: str, permission_type: str) -> None:
    server.viewer_line_value(cookie, {"window": "viewer.shell", "line": ["window", "allow", window, "--type", permission_type], "environment": "main"})


def test_the_registry_offers_one_inspector_slot_per_model_apart_from_the_button_slots(journal):
    registry = Registry.read(journal.database)
    assert {'inspector.plan', 'inspector.task', 'inspector.doc', 'inspector.report', 'inspector.agent', 'inspector.memory'} <= set(registry.inspector_slots)
    assert not any((slot.startswith('inspector.') for slot in registry.button_slots))


def test_a_section_on_an_unknown_slot_refuses_the_sync(journal):
    journal.expect_sync_refusal(section_modules.UNKNOWN_SLOT, "the window wrong_slot.notes uses unknown slot inspector.plna")


def test_a_section_with_no_slot_refuses_the_sync(journal):
    journal.expect_sync_refusal(section_modules.SLOTLESS_MODULE, "no_slot.notes is a section and names no slot")


def test_slots_on_a_pane_window_refuse_the_sync(journal):
    journal.expect_sync_refusal(section_modules.PANE_WITH_SLOTS, "pane_slots.notes names slots, and only a section has them")


def test_a_suite_that_names_a_section_refuses_the_sync(journal):
    journal.expect_sync_refusal(section_modules.SECTION_SUITE_MODULE, "suite sections names the section section_suite.notes, which an inspector draws and no pane offers")


def test_a_button_on_an_inspector_slot_refuses_the_sync(journal):
    journal.expect_sync_refusal(section_modules.INSPECTOR_SLOT_BUTTON, "uses unknown slot inspector.plan")


def test_a_correct_section_syncs_into_the_registry(journal):
    journal.expect_sync_success(section_modules.GOOD_SECTION)
    entry = Registry.read(journal.database).window("good_section.notes")
    expect_row(entry, place="section", slots=tuple(["inspector.plan"]), module="good_section")
