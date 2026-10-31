import pytest

from core.base.command.bus import Bus
from core.base.refusal import Refusal
from core.modules.chat.commands.show_mark import ShowMark
from core.modules.messages.models.enums.message_mark_type import MessageMarkType
from core.modules.messages.models.enums.message_mark_variant import MessageMarkVariant
from tests.stories.core.modules.chat.support.mark_samples import mark_count, marks_text, module_actor
from tests.stories.core.support import story_lines as lines
from tests.stories.core.support.coding_fixtures import BuilderWithOpenTask


def test_a_task_started_shows_a_mark_after_the_commit(new_story):
    story = new_story(fixture=BuilderWithOpenTask)
    story.expect_success(lines.TASK_START, actor=story.agent)
    story.run_listeners()
    assert "Task 1 started" in marks_text(story), marks_text(story)


def test_a_task_closed_shows_a_mark(new_story):
    story = new_story(fixture=BuilderWithOpenTask)
    story.run(lines.TASK_START, actor=story.agent)
    story.expect_success(lines.TASK_CLOSE, actor=story.agent)
    story.run_listeners()
    assert "Task 1 closed" in marks_text(story), marks_text(story)


def test_a_task_blocked_shows_a_mark(new_story):
    story = new_story(fixture=BuilderWithOpenTask)
    story.run(lines.TASK_START, actor=story.agent)
    story.expect_success('task block 1 --reason "waits on the user"', actor=story.agent)
    story.run_listeners()
    assert "Task 1 blocked" in marks_text(story), marks_text(story)


def test_a_refused_move_shows_no_task_mark(new_story):
    story = new_story(fixture=BuilderWithOpenTask)
    before = mark_count(story)
    story.expect_refusal(lines.TASK_CLOSE, "is open", actor=story.agent)
    story.run_listeners()
    assert mark_count(story) == before


def test_the_tasks_module_writes_only_its_own_marks(new_story):
    story = new_story(fixture=BuilderWithOpenTask)
    with pytest.raises(Refusal, match="only journal.core.messages writes a mark of messages.thought"):
        story.container.get(Bus).run(ShowMark(1, MessageMarkType.THOUGHT, MessageMarkVariant.SAID, "thought:9", "A mark"), module_actor(story, "journal.core.tasks"))
