from core.base.database.database import Database
from core.base.registry.registry import Registry
from tests.stories.core.modules.viewer.support.button_module import PATH, NotesButtonsModule
from tests.stories.core.support.fixtures import MainEnvironment
from core.testing.expect_row import expect_row


def test_the_registry_lists_slots_for_the_shipped_models_and_docks(new_story):
    story = new_story(fixture=MainEnvironment)
    registry = Registry.read(story.container.get(Database))
    story.expect_rows({"row.plan", "row.task", "row.template", "dock.plans.waiting", "dock.plans.started"}
                      <= set(registry.button_slots), len(registry.button_slots) == len(set(registry.button_slots)))


def test_a_module_adds_a_named_button_slot(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_sync_success(PATH)
    registry = Registry.read(story.container.get(Database))
    story.expect_rows("notes.toolbar" in registry.button_slots, "row.plan" in registry.button_slots)
    entry = next(button for button in registry.buttons if button.module == "notes")
    expect_row(entry, declaration=NotesButtonsModule.buttons[0], shipped=False)
