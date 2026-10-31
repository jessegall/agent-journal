from core.base.database.database import Database
from core.base.registry.registry import Registry
from tests.stories.core.base.chat.support.mark_faults import PATH
from tests.stories.core.support.fixtures import MainEnvironment


def test_a_synced_mark_is_registered_with_every_field_it_declares(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_sync_success(f"{PATH}:GoodModule")
    mark = Registry.read(story.container.get(Database)).marks[0]
    assert (mark.type, mark.module, mark.family, mark.family_title, mark.group, mark.colouring, tuple(mark.variants)) == ("good.note", "good", "notes", "Notes", "work", "group", ("plain",))
    assert (mark.label, mark.mark_icon, mark.click, mark.grouping, mark.group_label, mark.body) == ("Notes", "words", "unfold", "family", "{family}: {count} updates", "note.js")
    assert (list(mark.buttons), mark.shown, mark.main, mark.process, mark.shipped, mark.unavailable_reason) == ([{"icon": "words", "label": "Open", "runs": "task edit {row_id}"}], True, True, False, False, "")


def test_a_synced_dock_is_registered_with_every_field_it_declares(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_sync_success(f"{PATH}:GoodModule")
    dock = Registry.read(story.container.get(Database)).docks[0]
    assert (dock.type, dock.module, dock.icon, dock.title, dock.body, dock.most, dock.leaves_after_seconds, tuple(dock.reads)) == ("good.note", "good", "words", "{row_title}", "note.js", 1, 0, ("task list",))
    assert (list(dock.buttons), dock.shipped, dock.unavailable_reason) == ([], False, "")


def test_a_mark_and_dock_built_for_another_kit_are_recorded_as_unavailable_and_not_refused(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_sync_success(f"{PATH}:NewerKitModule")
    registry = Registry.read(story.container.get(Database))
    reason = "built for window kit >=2,<3; this viewer has kit 1"
    assert (registry.marks[0].unavailable_reason, registry.docks[0].unavailable_reason) == (reason, reason)


def test_a_mark_and_dock_built_for_this_kit_are_available(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_sync_success(f"{PATH}:GoodModule")
    registry = Registry.read(story.container.get(Database))
    assert (registry.marks[0].unavailable_reason, registry.docks[0].unavailable_reason) == ("", "")
