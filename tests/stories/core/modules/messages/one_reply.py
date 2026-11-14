from datetime import timedelta

from tests.stories.core.support.fixtures import MessageAnswered
from tests.stories.core.modules.drivers.support.confirmed_skips import confirmed_skip


def answered_story(new_story):
    return new_story(fixture=MessageAnswered)


def test_confirm_and_skip_guard_both_pass_it_with_a_reason_after_a_refusal(new_story):
    story = answered_story(new_story)
    story.expect_refusal('message reply 1 "Done now" --environment main', "already has your reply", actor=story.agent)
    confirmed_skip(story, "messages.one-reply-per-message", story.agent, "it adds the result")
    story.advance(timedelta(seconds=1))
    story.expect_success('message reply 1 "Done now" --confirm --skip-reason "it adds the result" --environment main', "parent_id: 1", actor=story.agent)
    story.advance(timedelta(seconds=1))
    story.expect_refusal('message reply 1 "And tested" --environment main', "already has your reply", actor=story.agent)
    confirmed_skip(story, "messages.one-reply-per-message", story.agent, "it adds the tests")
    story.advance(timedelta(seconds=1))
    story.expect_success('message reply 1 "And tested" --skip-guard messages.one-reply-per-message --skip-reason "it adds the tests" --environment main', "parent_id: 1", actor=story.agent)


def test_the_first_reply_and_a_users_message_never_meet_it(new_story):
    story = answered_story(new_story)
    story.expect_success('message reply 1 "Thanks" --environment main', "type: user", actor=story.user)
    story.expect_success('message reply 1 "And thanks again" --environment main', "type: user", actor=story.user)
