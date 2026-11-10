from core.base.database.database import Database
from core.base.registry.registry import Registry
from tests.stories.engine.chat.support.mark_faults import PATH
from tests.stories.core.support.fixtures import MainEnvironment
from core.testing.expect_row import expect_row


def test_a_synced_mark_is_registered_with_every_field_it_declares(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_sync_success(f"{PATH}:GoodModule")
    mark = next(entry for entry in Registry.read(story.container.get(Database)).marks if entry.module == "good")
    expect_type_mark_module(mark, ("good.note", "good", "notes", "Notes", "work", "group", ["plain"]))
    expect_row(mark, label="Notes", mark_icon="words", click="unfold", grouping="family", group_label="{family}: {count} updates", body="note.js")
    expect_buttons_mark_shown(mark, ([{"icon": "words", "label": "Edit the task", "runs": "task edit {row_id}", "primary": False, "variants": []}], True, True, False, False, ""))


def test_a_synced_dock_is_registered_with_every_field_it_declares(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_sync_success(f"{PATH}:GoodModule")
    dock = next(entry for entry in Registry.read(story.container.get(Database)).docks if entry.module == "good")
    expect_type_dock_module(dock, ("good.note", "good", "words", "{row_title}", "note.js", 1, 0, ["task list"]))
    expect_dock_buttons(dock, ([], False, ""))


def test_a_mark_and_dock_built_for_another_kit_are_recorded_as_unavailable_and_not_refused(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_sync_success(f"{PATH}:NewerKitModule")
    registry = Registry.read(story.container.get(Database))
    reason = "built for window kit >=2,<3; this viewer has kit 1"
    expect_unavailable_reason_next(registry, "good", "good", (reason, reason))


def test_a_mark_and_dock_built_for_this_kit_are_available(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_sync_success(f"{PATH}:GoodModule")
    registry = Registry.read(story.container.get(Database))
    expect_unavailable_reason_next(registry, "good", "good", ("", ""))


def expect_unavailable_reason_next(registry, text, text_2, expected) -> None:
    actual = (next((entry for entry in registry.marks if entry.module == text)).unavailable_reason, next((entry for entry in registry.docks if entry.module == text_2)).unavailable_reason)
    assert actual == expected, actual


def expect_dock_buttons(dock, expected) -> None:
    actual = (list(dock.buttons), dock.shipped, dock.unavailable_reason)
    assert actual == expected, actual


def expect_type_dock_module(dock, expected) -> None:
    actual = (dock.type, dock.module, dock.icon, dock.title, dock.body, dock.most, dock.leaves_after_seconds, list(dock.reads))
    assert actual == expected, actual


def expect_buttons_mark_shown(mark, expected) -> None:
    actual = (list(mark.buttons), mark.shown, mark.main, mark.process, mark.shipped, mark.unavailable_reason)
    assert actual == expected, actual


def expect_type_mark_module(mark, expected) -> None:
    actual = (mark.type, mark.module, mark.family, mark.family_title, mark.group, mark.colouring, list(mark.variants))
    assert actual == expected, actual
