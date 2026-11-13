import pytest

from tests.stories.suites.coding.support.main_controls_fixture import MainControlsActors, person_viewer
from tests.stories.suites.coding.support.settings_modal import Modal
from tests.stories.support.story_checks import expect_value, expect_value_4

from core.modules.plan_reviews.support.plan_review_settings import QUICK_REVIEW_SETTING as REVIEW, REVIEW_MODEL_SETTING as MODEL
from core.modules.plans.support.plan_settings import CHECKPOINT_COMMAND_SETTING as COMMAND, WAIT_FOR_PERSON_SETTING as WAIT


@pytest.fixture
def modal(new_story):
    story = new_story(fixture=MainControlsActors)
    with person_viewer(story) as viewer:
        yield story, Modal(viewer)


def test_the_checkpoints_section_is_on_the_work_screen_and_the_model_needs_the_review_that_is_off(modal):
    _, screens = modal
    nodes = screens.nodes("work")
    expect_value({key for key, node in nodes.items() if node["section"] == "Checkpoints"}, {REVIEW, MODEL, COMMAND, WAIT})
    expect_value((nodes[REVIEW]["value"], nodes[MODEL]["requires"]), (False, [REVIEW]))


def test_turning_the_review_on_and_choosing_a_model_saves_both_and_the_screen_gives_them_back(modal):
    _, screens = modal
    screens.save({REVIEW: "on", MODEL: "equal", COMMAND: "journal test"}, "work")
    expect_value([screens.value("work", key) for key in (REVIEW, MODEL, COMMAND)], [True, "equal", "journal test"])


def test_waiting_for_the_person_is_off_until_turned_on_and_an_agent_cannot_turn_it_on(modal):
    story, screens = modal
    expect_value_4(screens.value("work", WAIT) is False)
    story.expect_refusal(f"setting set {WAIT} on --environment main --reason 'a story asks'", "A user was asked", actor=story.agent)
    expect_value_4(screens.value("work", WAIT) is False)
    screens.save({WAIT: "on"}, "work")
    expect_value_4(screens.value("work", WAIT) is True)
    story.expect_text(f"setting show {WAIT} --environment main", "value:", actor=story.user)
