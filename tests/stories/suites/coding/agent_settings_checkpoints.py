import pytest

from tests.stories.suites.coding.support.main_controls_fixture import MainControlsActors, person_viewer
from tests.stories.suites.coding.support.settings_modal import Modal

GROUP = "journal.core.plans.checkpoints"
REVIEW, MODEL, COMMAND, WAIT = (f"{GROUP}.{name}" for name in ("quick-review", "review-model", "command", "wait-for-person"))


@pytest.fixture
def modal(new_story):
    story = new_story(fixture=MainControlsActors)
    with person_viewer(story) as viewer:
        yield story, Modal(viewer)


def test_the_checkpoints_section_is_on_the_work_screen_and_the_model_needs_the_review_that_is_off(modal):
    _, screens = modal
    nodes = screens.nodes("work")
    assert {key for key, node in nodes.items() if node["section"] == "Checkpoints"} == {REVIEW, MODEL, COMMAND, WAIT}
    assert (nodes[REVIEW]["value"], nodes[MODEL]["requires"]) == (False, [REVIEW])


def test_turning_the_review_on_and_choosing_a_model_saves_both_and_the_screen_gives_them_back(modal):
    _, screens = modal
    screens.save({REVIEW: "on", MODEL: "equal", COMMAND: "journal test"}, "work")
    assert [screens.value("work", key) for key in (REVIEW, MODEL, COMMAND)] == [True, "equal", "journal test"]


def test_waiting_for_the_person_is_off_until_turned_on_and_an_agent_cannot_turn_it_on(modal):
    story, screens = modal
    assert screens.value("work", WAIT) is False
    story.expect_refusal(f"setting set {WAIT} on --environment main --reason 'a story asks'", "A user was asked", actor=story.agent)
    assert screens.value("work", WAIT) is False
    screens.save({WAIT: "on"}, "work")
    assert screens.value("work", WAIT) is True
    story.expect_text(f"setting show {WAIT} --environment main", "value:", actor=story.user)
