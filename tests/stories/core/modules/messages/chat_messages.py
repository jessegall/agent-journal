from tests.stories.core.support.fixtures import UnansweredMessage
from tests.stories.core.support import story_lines as lines
from tests.stories.core.support.fixtures import UserJoined
from core.base.actor import Actor, ActorType
from tests.stories.core.modules.tasks.task_lifecycle import started_story


def user_story(new_story):
    return new_story(fixture=UserJoined)


def test_a_message_is_sent_as_the_caller_in_the_callers_environment(new_story):
    story = user_story(new_story)
    story.expect_success(lines.USER_MESSAGE, "type: user", "text: Fix the cart first", "environment_id: 1", actor=story.user)
    story.expect_success('message send "On it" --environment main', "type: agent", f"agent_id: {story.agent.id}", actor=story.agent)


def test_reading_a_message_marks_it_read_once(new_story):
    story = new_story(fixture=UnansweredMessage)
    story.expect_success("message read 1", "read_at: 2026-10-31T09:00:00.000000+00:00", actor=story.agent)
    story.expect_success("message read 1", "version: 2", actor=story.agent)


def test_a_reply_names_the_message_it_answers(new_story):
    story = new_story(fixture=UnansweredMessage)
    story.expect_success('message reply 1 "On it" --environment main', "parent_id: 1", "type: agent", actor=story.agent)


def test_an_environments_chat_is_listed_in_the_order_written(new_story):
    story = new_story(fixture=UnansweredMessage)
    story.run('message reply 1 "On it" --environment main', actor=story.agent)
    story.expect_success("message list --environment 1 --oldest", "1  user  Fix the cart first", f"2  {story.agent.id}  1  agent  On it")


def test_a_message_has_no_make_and_needs_an_environment(new_story):
    story = user_story(new_story)
    story.expect_usage_error('message make "hello"')
    story.expect_refusal('message send "hello"', "a message is sent in an environment", actor=story.user)
