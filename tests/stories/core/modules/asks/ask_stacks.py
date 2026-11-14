from tests.stories.core.support.fixtures import UserJoined


def test_a_new_journal_has_no_asks_and_no_question_stacks(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_text("ask list", "nothing found", actor=story.user)
    story.expect_text("ask-stack list", "nothing found", actor=story.user)


def test_approving_a_question_stack_that_does_not_exist_is_refused(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_refusal("ask-stack approve 99", "99", actor=story.user)
