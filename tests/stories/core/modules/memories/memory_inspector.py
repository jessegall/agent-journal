from engine.database.database import Database
from engine.registry.registry import Registry
from core.modules.memories.models.memory import Memory
from tests.stories.core.support.fixtures import MainEnvironment
from tests.stories.support.story_checks import expect_value


def memory_entry(story):
    registry = Registry.read(story.container.get(Database))
    return registry, next(entry for entry in registry.inspectors if entry.declaration.model is Memory)


def test_a_standing_memory_offers_remove_and_a_removed_one_restore(new_story):
    story = new_story(fixture=MainEnvironment)
    registry, entry = memory_entry(story)
    actions = {action.name: action for action in entry.declaration.actions}
    expect_value((actions["memories.remove"].label, tuple(actions["memories.remove"].condition.values)), ("Remove the memory", tuple(["active"])))
    expect_value([field.name for field in actions["memories.remove"].fields], ["reason"])
    expect_value((actions["memories.restore"].label, tuple(actions["memories.restore"].condition.values), actions["memories.restore"].primary), ("Restore the memory", tuple(["removed"]), True))
    buttons = {button.declaration.name: button.declaration for button in registry.buttons}
    expect_value(tuple(buttons["memories.remove"].slots), tuple(["row.memory"]))
    expect_value(tuple(buttons["memories.restore"].slots), tuple(["row.memory"]))


def test_the_memory_inspector_declares_its_facts_component(new_story):
    story = new_story(fixture=MainEnvironment)
    registry, entry = memory_entry(story)
    expect_value([component.window for component in entry.declaration.components], ["memories.memory-facts"])
    window = next(window for window in registry.windows if window.name == "memories.memory-facts")
    expect_value((window.place, tuple(window.reads)), ("section", tuple(["memory-keyword list"])))
