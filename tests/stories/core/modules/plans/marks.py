from core.testing.story_fixture import StoryFixture

from core.base.database.database import Database
from core.base.registry.registry import Registry
from tests.stories.core.support.coding_fixtures import BuilderStarted
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.core.modules.chat.support.v4_looks import PLAN, expect_declared_appearance
import pytest

from engine.command.bus import Bus
from engine.errors.refusal import Refusal
from core.modules.chat.commands.show_mark.show_mark import ShowMark
from core.modules.tasks.models.enums.task_mark_type import TaskMarkType
from core.modules.tasks.models.enums.task_mark_variant import TaskMarkVariant
from tests.stories.core.modules.chat.support.mark_samples import mark_count, marks_text, module_actor, expect_mark_count, expect_marks_text
from tests.stories.core.support import story_lines as lines
from core.testing.expect_row import expect_row


class ApprovedPlan(StoryFixture):
    parent = UserJoined

    def steps(self, story):
        story.run(lines.NEW_PLAN)
        story.run("plan ready 1")
        story.run("plan approve 1 --environment main", actor=story.user)


def started_plan(new_story):
    return new_story(fixture=ApprovedPlan)


def test_a_plan_started_shows_a_mark_after_the_commit(new_story):
    story = started_plan(new_story)
    story.expect_success("plan start 1", actor=story.agent)
    story.run_listeners()
    expect_marks_text(story, "Plan 1 started")


def test_a_plan_closed_shows_a_mark(running_plan):
    story = running_plan
    story.expect_success("plan close 1", actor=story.agent)
    story.run_listeners()
    expect_marks_text(story, "Plan 1 closed")


def test_a_refused_plan_move_shows_no_plan_mark(new_story):
    story = started_plan(new_story)
    starting_count = mark_count(story)
    story.expect_refusal("plan unblock 1", "is approved", actor=story.agent)
    story.run_listeners()
    expect_mark_count(story, starting_count)


def test_the_plans_module_writes_only_its_own_marks(new_story):
    story = started_plan(new_story)
    with pytest.raises(Refusal, match="only journal.core.tasks writes a mark of tasks.task"):
        story.container.get(Bus).run(ShowMark(TaskMarkType.TASK, TaskMarkVariant.STARTED, "task:9", "A mark"), module_actor(story, "journal.core.plans"), environment_id=1)


def test_the_plan_mark_is_declared_as_version_4_showed_it(new_story):
    expect_declared_appearance(new_story(fixture=BuilderStarted), PLAN)


def test_a_started_plan_is_docked_and_undocked_when_it_ends(running_plan):
    story = running_plan
    story.expect_text("dock-item list", "plans.started", "docked")
    story.run("plan close 1", actor=story.agent)
    story.expect_text("dock-item show 1", "state: undocked")


def test_a_plan_made_shows_a_mark_that_opens_the_plan(new_story):
    story = new_story(fixture=UserJoined)
    story.run(lines.NEW_PLAN)
    story.run_listeners()
    mark = next(entry for entry in Registry.read(story.container.get(Database)).marks if entry.type == "plans.plan")
    expect_marks_text(story, "Plan 1 created")
    expect_row(mark, click="open row")


def test_a_plan_card_follows_where_the_plan_stands(new_story):
    story = new_story(fixture=UserJoined)
    story.run(lines.NEW_PLAN)
    story.run("plan ready 1")
    story.run_listeners()
    story.expect_text("dock-item list", "plans.waiting", "docked")
    story.run("plan approve 1 --environment main", actor=story.user)
    story.run("plan start 1", actor=story.agent)
    story.run_listeners()
    story.expect_text("dock-item list", "plans.started", "docked")
    story.run('plan block 1 --reason "waiting for the rates"', actor=story.agent)
    story.run_listeners()
    story.expect_text("dock-item list", "plans.paused", "docked")


@pytest.fixture
def running_plan(new_story):
    story = started_plan(new_story)
    story.run("plan start 1", actor=story.agent)
    return story
