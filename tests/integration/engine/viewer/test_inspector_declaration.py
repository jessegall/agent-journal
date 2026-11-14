from core.modules.reminders.models.reminder import Reminder
from engine.registry.registry import Registry
from tests.stories.engine.viewer.support.inspector_modules import PATH
from tests.stories.support.story_checks import expect_value


def test_a_module_can_declare_an_inspector_and_the_registry_keeps_it(journal):
    journal.expect_sync_success(f"{PATH}:InspectorModule")
    expect_value(Reminder in [entry.declaration.model for entry in Registry.read(journal.database).inspectors], True)


def test_a_module_without_inspectors_syncs_as_before(journal):
    module_inspectors = Registry.read(journal.database).inspectors
    journal.expect_sync_success(f"{PATH}:PlainModule")
    expect_value(Registry.read(journal.database).inspectors, module_inspectors)
