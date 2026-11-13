from tests.stories.core.support.agent_labels import agent_number
from tests.stories.suites.coding.support.main_controls_fixture import MainControlsActors, agent_actors
from suites.coding.support.shipped_profiles import DEBUGGER_PROFILE

DOCUMENT = 'doc make "A trace" --abstract "Where the fault starts" --body "It starts in the cart."'
REPORT = 'report make "A trace" --abstract "Where the fault starts" --body "It starts in the cart."'


def test_a_debugger_is_refused_a_document_with_the_report_hint_and_a_designer_may_file_one(new_story):
    story = new_story(fixture=MainControlsActors)
    actors = agent_actors(story)
    story.expect_success(f"agent edit {agent_number(story, actors['helper'].id)} --profile {DEBUGGER_PROFILE.name}")
    story.expect_refusal(DOCUMENT, "files reports, not documents", actor=actors["helper"])
    story.expect_refusal(DOCUMENT, "journal report make", actor=actors["helper"])
    story.expect_success(REPORT, actor=actors["helper"])
    story.expect_success(DOCUMENT, actor=actors["designer"])
