import json

from core.base.database.database import Database
from core.base.registry.registry import Registry
from tests.stories.core.base.chat.support.mark_faults import PATH
from tests.stories.core.support.fixtures import MainEnvironment


def test_a_removed_module_takes_its_mark_and_dock_entries_out_of_the_registry_without_a_refusal(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_sync_success(f"{PATH}:GoodModule")
    modules = json.loads(story.home.module_list.read_text())
    story.home.module_list.write_text(json.dumps([module for module in modules if module != f"{PATH}:GoodModule"]))
    code, output = story.synced()
    registry = Registry.read(story.container.get(Database))
    assert code == 0 and ([mark for mark in registry.marks if mark.module == "good"], [dock for dock in registry.docks if dock.module == "good"]) == ([], []), output


def test_a_changed_declaration_replaces_the_old_type_in_the_registry(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_sync_success(f"{PATH}:GoodModule")
    modules = json.loads(story.home.module_list.read_text())
    story.home.module_list.write_text(json.dumps([f"{PATH}:ChangedModule" if module == f"{PATH}:GoodModule" else module for module in modules]))
    code, output = story.synced()
    registry = Registry.read(story.container.get(Database))
    assert code == 0 and [mark.type for mark in registry.marks if mark.module == "good"] == ["good.memo"] and [dock for dock in registry.docks if dock.module == "good"] == [], output
