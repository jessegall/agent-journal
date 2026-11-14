from engine.testing.stories.story_fixture import StoryFixture

from engine.database.database import Database
from engine.registry.registry import Registry
import pytest

from engine.errors.refusal import Refusal
from core.modules.chat.commands.show_mark.show_mark import ShowMark
from core.modules.messages.models.enums.message_mark_type import MessageMarkType
from core.modules.messages.models.enums.message_mark_variant import MessageMarkVariant
from tests.stories.core.modules.chat.support.mark_samples import mark_count, marks_text, module_actor, expect_absent_marks_text, expect_mark_count, expect_marks_text
from tests.stories.core.support import story_lines as lines
from tests.stories.core.support.coding_fixtures import OpenTaskBuilder
from engine.testing.expectations.expect_row import expect_row
from tests.stories.support.story_checks import expect_output














def test_a_task_made_shows_a_mark_that_opens_the_task(played):
    story = played(OpenTaskBuilder)
    story.run_listeners()
    mark = next(entry for entry in Registry.read(story.container.get(Database)).marks if entry.type == "tasks.task")
    expect_marks_text(story, "Task 1 created")
    expect_row(mark, click="open row")
    expect_absent_marks_text(story, "Task 1 made")
    expect_marks_text(story, "tasks.task  made")


def test_a_task_edited_by_an_agent_shows_a_mark_that_opens_the_task(played):
    story = played(OpenTaskBuilder)
    story.expect_success('task edit 1 --title "Fix the cart total"', actor=story.agent)
    story.run_listeners()
    mark = next(entry for entry in Registry.read(story.container.get(Database)).marks if entry.type == "tasks.task")
    expect_marks_text(story, "Task 1 edited: Fix the cart total")
    expect_row(mark, click="open row")
    expect_marks_text(story, "tasks.task  edited")




class StartedTaskMark(StoryFixture):
    parent = OpenTaskBuilder

    def steps(self, story):
        story.expect_success(lines.TASK_START, actor=story.agent)
        story.run_listeners()
