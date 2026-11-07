from tests.stories.core.base.viewer.support.button_label_faults import PATH
from tests.stories.core.support.fixtures import MainEnvironment

PANEL_WORD = "which starts with a panel word, and the panel owns those words"


def test_close_the_plan_is_refused(new_story):
    new_story(fixture=MainEnvironment).expect_sync_refusal(f"{PATH}:CloseModule", f"the button labelled.act of module labelled has the label Close the plan, {PANEL_WORD}")


def test_open_the_plan_for_review_is_refused(new_story):
    new_story(fixture=MainEnvironment).expect_sync_refusal(f"{PATH}:OpenModule", f"has the label Open the plan for review, {PANEL_WORD}")


def test_complete_the_plan_passes(new_story):
    new_story(fixture=MainEnvironment).expect_sync_success(f"{PATH}:LabelModule")


def test_a_mark_button_starting_with_dismiss_is_refused(new_story):
    new_story(fixture=MainEnvironment).expect_sync_refusal(f"{PATH}:MarkButtonModule", f"has the label Dismiss the note, {PANEL_WORD}")


def test_the_shipped_modules_still_sync(new_story):
    story = new_story(fixture=MainEnvironment)
    code, report = story.synced()
    assert code == 0, report
