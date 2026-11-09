from tests.stories.core.modules.chat.support.v4_looks import FILED, SUMMARY, expect_declared_appearance
from core.base.command.bus import Bus
from core.base.refusal import Refusal
import pytest

from core.modules.chat.commands.show_mark.show_mark import ShowMark
from core.modules.messages.models.enums.message_mark_type import MessageMarkType
from core.modules.messages.models.enums.message_mark_variant import MessageMarkVariant
from core.modules.tasks.models.enums.task_mark_type import TaskMarkType
from core.modules.tasks.models.enums.task_mark_variant import TaskMarkVariant
from tests.stories.core.modules.chat.support.mark_samples import mark_count, marks_text, module_actor, expect_absent_marks_text, expect_mark_count, expect_marks_text
from tests.stories.core.support.fixtures import UnansweredMessage


def test_an_agents_message_is_one_bubble_and_makes_no_mark_of_its_words(new_story):
    story = new_story(fixture=UnansweredMessage)
    story.expect_success('message reply 1 "On it, fixing the cart" --environment main', actor=story.agent)
    story.run_listeners()
    expect_absent_marks_text(story, "On it, fixing the cart")


def test_a_failed_send_shows_no_mark(new_story):
    story = new_story(fixture=UnansweredMessage)
    story.expect_refusal('message send "no environment"', "a message needs an environment", actor=story.user)
    story.run_listeners()
    expect_mark_count(story, 0)


def test_the_messages_module_writes_only_its_own_marks(new_story):
    story = new_story(fixture=UnansweredMessage)
    with pytest.raises(Refusal, match="only journal.core.tasks writes a mark of tasks.task"):
        story.container.get(Bus).run(ShowMark(TaskMarkType.TASK, TaskMarkVariant.STARTED, "task:1", "A mark"), module_actor(story, "journal.core.messages"), environment_id=1)
    story.container.get(Bus).run(ShowMark(MessageMarkType.SUMMARY, MessageMarkVariant.SUMMARY, "thought:9", "A mark"), module_actor(story, "journal.core.messages"), environment_id=1)


def test_the_thought_mark_is_declared_as_version_4_showed_it(new_story):
    expect_declared_appearance(new_story(fixture=UnansweredMessage), SUMMARY)


def test_the_filed_mark_is_declared_as_version_4_showed_it(new_story):
    expect_declared_appearance(new_story(fixture=UnansweredMessage), FILED)


def test_a_message_edited_by_an_agent_shows_a_mark_that_opens_the_message(new_story):
    story = new_story(fixture=UnansweredMessage)
    story.expect_success('message edit 1 --text "Better words"', actor=story.agent)
    story.run_listeners()
    expect_marks_text(story, "Message 1 edited")
    expect_marks_text(story, "messages.edited  edited")


def test_a_message_edited_by_the_user_shows_no_edited_mark(new_story):
    story = new_story(fixture=UnansweredMessage)
    story.expect_success('message edit 1 --text "Better words"', actor=story.user)
    story.run_listeners()
    expect_absent_marks_text(story, "edited")


def test_a_message_sent_shows_no_edited_mark(initial_message_marks):
    story = initial_message_marks
    expect_absent_marks_text(story, "edited")


@pytest.fixture
def initial_message_marks(new_story):
    story = new_story(fixture=UnansweredMessage)
    story.run_listeners()
    return story
