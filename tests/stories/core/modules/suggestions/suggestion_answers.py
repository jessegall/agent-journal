import pytest

from tests.stories.core.support.fixtures import UserJoined

MAKER_ABSENT = "nothing makes a suggestion since task 8282 emptied the module; a maker comes first"


@pytest.mark.xfail(strict=True, reason=MAKER_ABSENT)
def test_the_main_agent_lists_the_open_suggestions_with_their_text(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_text("suggestion list --open", "suggestion 1", actor=story.agent)


@pytest.mark.xfail(strict=True, reason=MAKER_ABSENT)
def test_an_answered_suggestion_leaves_the_open_list_and_shows_its_answer(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success("suggestion answer 1 accepted", actor=story.user)
    story.expect_text("suggestion list", "accepted", actor=story.agent)


@pytest.mark.xfail(strict=True, reason=MAKER_ABSENT)
def test_answering_an_answered_suggestion_is_refused_with_the_earlier_answer(new_story):
    story = new_story(fixture=UserJoined)
    story.run("suggestion answer 1 accepted", actor=story.user)
    story.expect_refusal("suggestion answer 1 declined", "accepted", actor=story.user)
