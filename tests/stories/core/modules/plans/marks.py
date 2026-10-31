from core.base.database.database import Database
from core.base.registry.registry import Registry
from tests.stories.core.support.coding_fixtures import BuilderStarted
from tests.stories.core.modules.chat.support.v4_looks import PLAN, expect_declared_look
import pytest

from core.base.command.bus import Bus
from core.base.refusal import Refusal
from core.modules.chat.commands.show_mark import ShowMark
from core.modules.tasks.models.enums.task_mark_type import TaskMarkType
from core.modules.tasks.models.enums.task_mark_variant import TaskMarkVariant
from tests.stories.core.modules.chat.support.mark_samples import mark_count, marks_text, module_actor
from tests.stories.core.modules.tasks.task_lifecycle import started_story
from tests.stories.core.support import story_lines as lines


def started_plan(new_story):
    story = started_story(new_story)
    story.run(lines.NEW_PLAN)
    story.run("plan ready 1")
    story.run("plan approve 1")
    return story


def test_a_plan_started_shows_a_mark_after_the_commit(new_story):
    story = started_plan(new_story)
    story.expect_success("plan start 1", actor=story.agent)
    story.run_listeners()
    assert "Plan 1 started" in marks_text(story), marks_text(story)


def test_a_plan_closed_shows_a_mark(new_story):
    story = started_plan(new_story)
    story.run("plan start 1", actor=story.agent)
    story.expect_success("plan close 1", actor=story.agent)
    story.run_listeners()
    assert "Plan 1 closed" in marks_text(story), marks_text(story)


def test_a_refused_plan_move_shows_no_plan_mark(new_story):
    story = started_plan(new_story)
    before = mark_count(story)
    story.expect_refusal("plan close 1", "is approved", actor=story.agent)
    story.run_listeners()
    assert mark_count(story) == before


def test_the_plans_module_writes_only_its_own_marks(new_story):
    story = started_plan(new_story)
    with pytest.raises(Refusal, match="only journal.core.tasks writes a mark of tasks.task"):
        story.container.get(Bus).run(ShowMark(1, TaskMarkType.TASK, TaskMarkVariant.STARTED, "task:9", "A mark"), module_actor(story, "journal.core.plans"))


def test_the_plan_mark_is_declared_as_version_4_showed_it(new_story):
    expect_declared_look(new_story(fixture=BuilderStarted), PLAN)


def test_a_started_plan_is_docked_and_undocked_when_it_ends(new_story):
    story = started_plan(new_story)
    story.run("plan start 1", actor=story.agent)
    story.expect_text("dock-item list", "plans.started", "docked")
    story.run("plan close 1", actor=story.agent)
    story.expect_text("dock-item show 1", "state: undocked")


def test_a_plan_made_shows_a_mark_that_opens_the_plan(new_story):
    story = started_story(new_story)
    story.run(lines.NEW_PLAN)
    story.run_listeners()
    mark = next(entry for entry in Registry.read(story.container.get(Database)).marks if entry.type == "plans.plan")
    assert "Plan 1 made" in marks_text(story) and mark.click == "open row", marks_text(story)
