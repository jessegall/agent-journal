import pytest

from core.base.viewer.inspector_width import InspectorWidth
from core.base.viewer.panel_words import PanelWords
from core.base.database.database import Database
from core.base.registry.registry import Registry
from core.modules.reminders.models.reminder import Reminder
from tests.stories.core.base.viewer.support.inspector_modules import PATH
from tests.stories.core.support.fixtures import MainEnvironment
from tests.stories.support.story_checks import expect_value


def test_a_module_can_declare_an_inspector_and_the_registry_keeps_it(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_sync_success(f"{PATH}:InspectorModule")
    expect_value(Reminder in [entry.declaration.model for entry in Registry.read(story.container.get(Database)).inspectors], True)


def test_a_module_without_inspectors_syncs_as_before(new_story):
    story = new_story(fixture=MainEnvironment)
    before = Registry.read(story.container.get(Database)).inspectors
    story.expect_sync_success(f"{PATH}:PlainModule")
    expect_value(Registry.read(story.container.get(Database)).inspectors, before)


def test_an_inspector_is_drawn_at_one_of_four_widths():
    expect_value([width.value for width in InspectorWidth], ["small", "medium", "large", "wide"])


@pytest.mark.parametrize("label", ["Close the plan", "open it", "BACK to work"])
def test_a_label_starting_with_a_panel_word_is_found_whatever_its_case(label):
    expect_value(bool(PanelWords.begins(label)), True)


@pytest.mark.parametrize("label", ["Complete the plan", "Reopen the task", "Plan: close it"])
def test_a_label_not_starting_with_a_panel_word_is_not_found(label):
    expect_value(bool(PanelWords.begins(label)), False)


def test_reopen_does_not_start_with_open():
    expect_value(bool(PanelWords.begins("Reopen the task")), False)
