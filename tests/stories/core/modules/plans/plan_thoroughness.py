from core.base.actor import Actor
from engine.enums.actor_type import ActorType
from core.testing.story_fixture import StoryFixture
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.core.modules.drivers.support.confirmed_skips import confirmed_skip


class OneTaskPhasePlan(StoryFixture):
    """Plan 1 has phase 1 with task 1 alone and phase 2 with tasks 2 and 3."""

    parent = UserJoined

    def steps(self, story) -> None:
        story.expect_success('plan make "The rebuild" --environment main', actor=story.agent)
        story.expect_success('phase make --plan 1 "Build" --goal "it builds"', actor=story.agent)
        story.expect_success('phase make --plan 1 "Ship" --goal "it ships"', actor=story.agent)
        story.expect_success('task make "Build it" --brief "Build it" --phase 1 --environment main', actor=story.agent)
        story.expect_success('task make "Package it" --brief "Package it" --phase 2 --environment main', actor=story.agent)
        story.expect_success('task make "Publish it" --brief "Publish it" --phase 2 --environment main', actor=story.agent)


def test_a_plan_with_a_one_task_phase_is_not_made_ready_until_a_reason_is_given(new_story):
    story = new_story(fixture=OneTaskPhasePlan)
    story.expect_refusal("plan ready 1", "phase 1 of plan 1 has one task", actor=story.agent)
    story.expect_success("plan show 1", "state: draft", actor=story.agent)


def test_a_reason_lets_a_plan_with_a_one_task_phase_be_made_ready(new_story):
    story = new_story(fixture=OneTaskPhasePlan)
    story.expect_refusal("plan ready 1", "only if this refusal is wrong for the case in hand, never to get on faster: --skip-guard plans.one-task-phase", actor=story.agent)
    confirmed_skip(story, "plans.one-task-phase", story.agent)
    story.expect_success("task depend 2 --on 1", actor=story.agent)
    story.expect_success("task depend 3 --on 2", actor=story.agent)
    story.expect_success('plan ready 1 --skip-guard plans.one-task-phase --skip-reason "the phase is one command"', "state: ready", actor=story.agent)


def test_a_plan_whose_phases_each_have_two_tasks_is_made_ready_without_a_reason(new_story):
    story = new_story(fixture=OneTaskPhasePlan)
    story.expect_success('task make "Test it" --brief "Test it" --phase 1 --environment main', actor=story.agent)
    for task, required_task in ((2, 1), (3, 2), (4, 3)):
        story.expect_success(f"task depend {task} --on {required_task}", actor=story.agent)
    story.expect_success("plan ready 1", "state: ready", actor=story.agent)


def test_the_planning_skill_says_to_keep_phases_small(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success("skill write", actor=story.agent)
    skill = story.home.folder.parent / ".claude" / "skills" / "journal-planning" / "SKILL.md"
    story.expect_rows("keep phases small" in skill.read_text())


def test_a_helper_edits_and_makes_ready_a_plan_it_made(new_story):
    story = new_story(fixture=UserJoined)
    helper = Actor(story.new_row_id(f"agent start s-2 claude helper --parent {story.agent.id} --environment main"), ActorType.AGENT)
    story.expect_success('plan make "Helper plan" --environment main', actor=helper)
    story.expect_success('plan edit 1 --brief "Reach the goal"', "brief: Reach the goal", actor=helper)
    story.expect_success('phase make --plan 1 "Build" --goal "it builds"', actor=helper)
    story.expect_success('phase edit 1 --goal "it builds and runs"', "goal: it builds and runs", actor=helper)
    story.expect_success('task make "Build it" --brief "Build it" --phase 1 --environment main', actor=helper)
    story.expect_success('task make "Run it" --brief "Run it" --phase 1 --environment main', actor=helper)
    story.expect_success('task edit 1 --brief "Build it with the build command"', actor=helper)
    story.expect_success("task depend 2 --on 1", actor=helper)
    story.expect_success("plan ready 1", "state: ready", actor=helper)
