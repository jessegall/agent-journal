from tests.stories.core.support.fixtures import MessageAnswered
from tests.stories.core.modules.messages.chat_messages import user_story


def answered_story(new_story):
    return new_story(fixture=MessageAnswered)


def test_a_second_agent_reply_is_refused_with_the_flag_that_passes_it(new_story):
    story = answered_story(new_story)
    story.expect_refusal('message reply 1 "Still on it" --environment main',
                         "refused by messages.one-reply-per-message: message 1 already has your reply 2: send it again only if it adds something new"
                         " (to pass it: --confirm)", actor=story.agent)


def test_confirm_and_skip_guard_both_pass_it(new_story):
    story = answered_story(new_story)
    story.expect_success('message reply 1 "Done now" --confirm --environment main', "parent_id: 1", actor=story.agent)
    story.expect_success('message reply 1 "And tested" --skip-guard messages.one-reply-per-message --environment main', "parent_id: 1", actor=story.agent)


def test_the_first_reply_and_a_users_message_never_meet_it(new_story):
    story = answered_story(new_story)
    story.expect_success('message reply 1 "Thanks" --environment main', "type: user", actor=story.user)
    story.expect_success('message reply 1 "And thanks again" --environment main', "type: user", actor=story.user)
