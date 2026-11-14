from engine.registry.registry import Registry
from engine.testing.expectations.expect_row import expect_row
from tests.stories.core.modules.viewer.support.button_module import PATH, NotesButtonsModule


def test_the_registry_lists_slots_for_the_shipped_models_and_docks(journal):
    registry = Registry.read(journal.database)
    assert {'row.plan', 'row.task', 'row.template', 'dock.plans.waiting', 'dock.plans.started'} <= set(registry.button_slots)
    assert len(registry.button_slots) == len(set(registry.button_slots))


def test_a_module_adds_a_named_button_slot(journal):
    journal.expect_sync_success(PATH)
    registry = Registry.read(journal.database)
    assert 'notes.toolbar' in registry.button_slots
    assert 'row.plan' in registry.button_slots
    entry = next(button for button in registry.buttons if button.module == "notes")
    expect_row(entry, declaration=NotesButtonsModule.buttons[0], shipped=False)
