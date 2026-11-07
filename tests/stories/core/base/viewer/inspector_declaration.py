import pytest

from core.base.viewer.inspector_width import InspectorWidth
from core.base.viewer.panel_words import PanelWords
from core.base.database.database import Database
from core.base.registry.registry import Registry
from core.modules.reminders.models.reminder import Reminder
from tests.stories.core.base.viewer.support.inspector_modules import PATH
from tests.stories.core.support.fixtures import MainEnvironment


def test_a_module_can_declare_an_inspector_and_the_registry_keeps_it(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_sync_success(f"{PATH}:InspectorModule")
    assert Reminder in [entry.declaration.model for entry in Registry.read(story.container.get(Database)).inspectors]


def test_a_module_without_inspectors_syncs_as_before(new_story):
    story = new_story(fixture=MainEnvironment)
    before = Registry.read(story.container.get(Database)).inspectors
    story.expect_sync_success(f"{PATH}:PlainModule")
    assert Registry.read(story.container.get(Database)).inspectors == before


def test_an_inspector_is_drawn_at_one_of_four_widths():
    assert [width.value for width in InspectorWidth] == ["small", "medium", "large", "wide"]


@pytest.mark.parametrize("label", ["Close the plan", "open it", "BACK to work"])
def test_a_label_starting_with_a_panel_word_is_found_whatever_its_case(label):
    assert PanelWords.begins(label)


@pytest.mark.parametrize("label", ["Complete the plan", "Reopen the task", "Plan: close it"])
def test_a_label_not_starting_with_a_panel_word_is_not_found(label):
    assert not PanelWords.begins(label)


def test_reopen_does_not_start_with_open():
    assert not PanelWords.begins("Reopen the task")
