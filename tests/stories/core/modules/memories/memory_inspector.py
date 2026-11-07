from core.base.database.database import Database
from core.base.registry.registry import Registry
from core.modules.memories.models.memory import Memory
from tests.stories.core.support.fixtures import MainEnvironment


def memory_entry(story):
    registry = Registry.read(story.container.get(Database))
    return registry, next(entry for entry in registry.inspectors if entry.declaration.model is Memory)


def test_a_standing_memory_offers_remove_and_a_removed_one_restore(new_story):
    story = new_story(fixture=MainEnvironment)
    registry, entry = memory_entry(story)
    actions = {action.name: action for action in entry.declaration.actions}
    assert (actions["memories.remove"].label, tuple(actions["memories.remove"].condition.values)) == ("Remove the memory", ("active",))
    assert [field.name for field in actions["memories.remove"].fields] == ["reason"]
    assert (actions["memories.restore"].label, tuple(actions["memories.restore"].condition.values), actions["memories.restore"].primary) == ("Restore the memory", ("removed",), True)
    buttons = {button.declaration.name: button.declaration for button in registry.buttons}
    assert tuple(buttons["memories.remove"].slots) == ("row.memory",)
    assert tuple(buttons["memories.restore"].slots) == ("row.memory",)


def test_the_memory_inspector_declares_its_facts_component(new_story):
    story = new_story(fixture=MainEnvironment)
    registry, entry = memory_entry(story)
    assert [component.window for component in entry.declaration.components] == ["memories.memory-facts"]
    window = next(window for window in registry.windows if window.name == "memories.memory-facts")
    assert (window.place, tuple(window.reads)) == ("section", ("memory-keyword list",))
