from engine.enums.inspector_width import InspectorWidth
from engine.enums.panel_labels import PanelLabels
from tests.stories.support.story_checks import expect_value
import pytest


def test_an_inspector_is_drawn_at_one_of_four_widths():
    expect_value([width.value for width in InspectorWidth], ["small", "medium", "large", "wide"])


@pytest.mark.parametrize("label", ["Close the plan", "open it", "BACK to work"])
def test_a_label_starting_with_a_panel_word_is_found_whatever_its_case(label):
    expect_value(bool(PanelLabels.begins(label)), True)


@pytest.mark.parametrize("label", ["Complete the plan", "Reopen the task", "Plan: close it"])
def test_a_label_not_starting_with_a_panel_word_is_not_found(label):
    expect_value(bool(PanelLabels.begins(label)), False)


def test_reopen_does_not_start_with_open():
    expect_value(bool(PanelLabels.begins("Reopen the task")), False)
