from engine.testing.stories.story_fixture import StoryFixture

from engine.database.database import Database
from engine.registry.registry import Registry
from tests.stories.core.support.fixtures import UserJoined
import pytest

from engine.errors.refusal import Refusal
from core.modules.chat.commands.show_mark.show_mark import ShowMark
from core.modules.tasks.models.enums.task_mark_type import TaskMarkType
from core.modules.tasks.models.enums.task_mark_variant import TaskMarkVariant
from tests.stories.core.modules.chat.support.mark_samples import mark_count, marks_text, module_actor, expect_mark_count, expect_marks_text
from tests.stories.core.support import story_lines as lines
from engine.testing.expectations.expect_row import expect_row


class ApprovedPlan(StoryFixture):
    parent = UserJoined

    def steps(self, story):
        story.run(lines.NEW_PLAN)
        story.run("plan ready 1")
        story.run("plan approve 1 --environment main", actor=story.user)


class ReadyPlan(StoryFixture):
    parent = UserJoined

    def steps(self, story):
        story.run(lines.NEW_PLAN)
        story.run("plan ready 1")
        story.run_listeners()


def started_plan(played):
    return played(ApprovedPlan)












def test_a_plan_made_shows_a_mark_that_opens_the_plan(played):
    story = played(UserJoined)
    story.run(lines.NEW_PLAN)
    story.run_listeners()
    mark = next(entry for entry in Registry.read(story.container.get(Database)).marks if entry.type == "plans.plan")
    expect_marks_text(story, "Plan 1 created")
    expect_row(mark, click="open row")




@pytest.fixture
def running_plan(played):
    story = started_plan(played)
    story.run("plan start 1", actor=story.agent)
    return story


