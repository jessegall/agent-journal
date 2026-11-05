from core.testing.story_fixture import StoryFixture

from core.base.database.database import Database
from core.base.registry.registry import Registry
from tests.stories.core.modules.chat.support.v4_looks import TASK, expect_declared_appearance
import pytest

from core.base.command.bus import Bus
from core.base.refusal import Refusal
from core.modules.chat.commands.show_mark.show_mark import ShowMark
from core.modules.messages.models.enums.message_mark_type import MessageMarkType
from core.modules.messages.models.enums.message_mark_variant import MessageMarkVariant
from tests.stories.core.modules.chat.support.mark_samples import mark_count, marks_text, module_actor, expect_absent_marks_text, expect_mark_count, expect_marks_text
from tests.stories.core.support import story_lines as lines
from tests.stories.core.support.coding_fixtures import BuilderWithOpenTask
from core.testing.expect_row import expect_row
from tests.stories.support.story_checks import expect_output


def test_a_task_started_shows_a_mark_after_the_commit(new_story):
    story = new_story(fixture=StartedTaskMark)
    expect_marks_text(story, "Task 1 started")


def test_a_task_closed_shows_a_mark(new_story):
    story = new_story(fixture=BuilderWithOpenTask)
    story.run(lines.TASK_START, actor=story.agent)
    story.expect_success(lines.TASK_CLOSE, actor=story.agent)
    story.run_listeners()
    expect_marks_text(story, "Task 1 closed")


def test_a_task_blocked_shows_a_mark(new_story):
    story = new_story(fixture=BuilderWithOpenTask)
    story.run(lines.TASK_START, actor=story.agent)
    story.expect_success('task block 1 --reason "waits on the user"', actor=story.agent)
    story.run_listeners()
    expect_marks_text(story, "Task 1 blocked")


def test_a_refused_move_shows_no_task_mark(new_story):
    story = new_story(fixture=BuilderWithOpenTask)
    starting_text = mark_count(story)
    story.expect_refusal(lines.TASK_CLOSE, "is open", actor=story.agent)
    story.run_listeners()
    expect_mark_count(story, starting_text)


def test_the_tasks_module_writes_only_its_own_marks(new_story):
    story = new_story(fixture=BuilderWithOpenTask)
    with pytest.raises(Refusal, match="only journal.core.messages writes a mark of messages.thought"):
        story.container.get(Bus).run(ShowMark(MessageMarkType.SUMMARY, MessageMarkVariant.SUMMARY, "thought:9", "A mark"), module_actor(story, "journal.core.tasks"), environment_id=1)


def test_the_task_mark_is_declared_as_version_4_showed_it(new_story):
    expect_declared_appearance(new_story(fixture=BuilderWithOpenTask), TASK)


def test_a_task_is_docked_from_its_inspector_and_no_task_row_changes(new_story):
    story = new_story(fixture=BuilderWithOpenTask)
    starting_text = story.run("task show 1").output_text
    story.expect_success("dock add tasks.task task 1 --environment main", actor=story.user)
    expect_output(story, "task show 1", starting_text)


def test_a_task_made_shows_a_mark_that_opens_the_task(new_story):
    story = new_story(fixture=BuilderWithOpenTask)
    story.run_listeners()
    mark = next(entry for entry in Registry.read(story.container.get(Database)).marks if entry.type == "tasks.task")
    expect_marks_text(story, "Task 1 created")
    expect_row(mark, click="open row")
    expect_absent_marks_text(story, "Task 1 made")
    expect_marks_text(story, "tasks.task  made")


def test_a_task_edited_by_an_agent_shows_a_mark_that_opens_the_task(new_story):
    story = new_story(fixture=BuilderWithOpenTask)
    story.expect_success('task edit 1 --title "Fix the cart total"', actor=story.agent)
    story.run_listeners()
    mark = next(entry for entry in Registry.read(story.container.get(Database)).marks if entry.type == "tasks.task")
    expect_marks_text(story, "Task 1 edited: Fix the cart total")
    expect_row(mark, click="open row")
    expect_marks_text(story, "tasks.task  edited")


def test_a_task_edited_by_the_user_shows_no_edited_mark(new_story):
    story = new_story(fixture=BuilderWithOpenTask)
    story.expect_success('task edit 1 --title "Fix the cart total"', actor=story.user)
    story.run_listeners()
    expect_absent_marks_text(story, "edited")


def test_a_task_started_shows_a_started_mark_and_no_edited_mark(new_story):
    story = new_story(fixture=StartedTaskMark)
    expect_absent_marks_text(story, "edited")


class StartedTaskMark(StoryFixture):
    parent = BuilderWithOpenTask

    def steps(self, story):
        story.expect_success(lines.TASK_START, actor=story.agent)
        story.run_listeners()
