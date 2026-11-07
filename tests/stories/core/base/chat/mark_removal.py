import json

from core.base.database.database import Database
from core.base.registry.registry import Registry
from tests.stories.core.base.chat.support.mark_faults import PATH
from tests.stories.core.support.fixtures import MainEnvironment
from tests.stories.support.story_checks import expect_value


def test_a_removed_module_takes_its_mark_and_dock_entries_out_of_the_registry_without_a_refusal(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_sync_success(f"{PATH}:GoodModule")
    modules = json.loads(story.home.module_list.read_text())
    story.home.module_list.write_text(json.dumps([module for module in modules if module != f"{PATH}:GoodModule"]))
    code, output = story.synced()
    registry = Registry.read(story.container.get(Database))
    expect_value(code, 0)
    expect_mark_marks_registry(registry, "good", "good", ([], []))


def test_a_changed_declaration_replaces_the_old_type_in_the_registry(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_sync_success(f"{PATH}:GoodModule")
    modules = json.loads(story.home.module_list.read_text())
    story.home.module_list.write_text(json.dumps([f"{PATH}:ChangedModule" if module == f"{PATH}:GoodModule" else module for module in modules]))
    code, output = story.synced()
    registry = Registry.read(story.container.get(Database))
    expect_value(code, 0)
    expect_type_mark_marks(registry, "good", ["good.memo"])
    expect_dock_docks_registry(registry, "good", [])


def expect_type_mark_marks(registry, text, expected) -> None:
    actual = [mark.type for mark in registry.marks if mark.module == text]
    assert actual == expected, actual


def expect_dock_docks_registry(registry, text, expected) -> None:
    actual = [dock for dock in registry.docks if dock.module == text]
    assert actual == expected, actual


def expect_mark_marks_registry(registry, text, text_2, expected) -> None:
    actual = ([mark for mark in registry.marks if mark.module == text], [dock for dock in registry.docks if dock.module == text_2])
    assert actual == expected, actual
