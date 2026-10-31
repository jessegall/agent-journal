from tests.stories.core.modules.chat.support.v4_looks import FILED, THOUGHT, expect_declared_look
from core.base.command.bus import Bus
from core.base.refusal import Refusal
import pytest

from core.modules.chat.commands.show_mark import ShowMark
from core.modules.messages.models.enums.message_mark_type import MessageMarkType
from core.modules.messages.models.enums.message_mark_variant import MessageMarkVariant
from core.modules.tasks.models.enums.task_mark_type import TaskMarkType
from core.modules.tasks.models.enums.task_mark_variant import TaskMarkVariant
from tests.stories.core.modules.chat.support.mark_samples import mark_count, marks_text, module_actor
from tests.stories.core.support.fixtures import UnansweredMessage


def test_an_agents_message_shows_a_thought_mark_after_the_commit(new_story):
    story = new_story(fixture=UnansweredMessage)
    story.expect_success('message reply 1 "On it, fixing the cart" --environment main', actor=story.agent)
    story.run_listeners()
    assert "On it, fixing the cart" in marks_text(story) and mark_count(story) >= 1, marks_text(story)


def test_a_users_message_read_by_the_agent_shows_a_filed_mark(new_story):
    story = new_story(fixture=UnansweredMessage)
    story.expect_success("message read 1", actor=story.agent)
    story.run_listeners()
    assert "Filed from your message 1" in marks_text(story), marks_text(story)


def test_a_failed_send_shows_no_mark(new_story):
    story = new_story(fixture=UnansweredMessage)
    story.expect_refusal('message send "no environment"', "a message is sent in an environment", actor=story.user)
    story.run_listeners()
    assert mark_count(story) == 0


def test_the_messages_module_writes_only_its_own_marks(new_story):
    story = new_story(fixture=UnansweredMessage)
    with pytest.raises(Refusal, match="only journal.core.tasks writes a mark of tasks.task"):
        story.container.get(Bus).run(ShowMark(1, TaskMarkType.TASK, TaskMarkVariant.STARTED, "task:1", "A mark"), module_actor(story, "journal.core.messages"))
    story.container.get(Bus).run(ShowMark(1, MessageMarkType.THOUGHT, MessageMarkVariant.SAID, "thought:9", "A mark"), module_actor(story, "journal.core.messages"))


def test_the_thought_mark_is_declared_as_version_4_showed_it(new_story):
    expect_declared_look(new_story(fixture=UnansweredMessage), THOUGHT)


def test_the_filed_mark_is_declared_as_version_4_showed_it(new_story):
    expect_declared_look(new_story(fixture=UnansweredMessage), FILED)
