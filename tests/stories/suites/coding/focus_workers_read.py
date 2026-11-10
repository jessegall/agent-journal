from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.testing.stories.story import Story
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.modules.plans.support.started_plans import DEFAULT_FOCUS, PLAN_FOCUS
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.core.support.plan_steps import started_plan

WORKER_NUMBER = 2


class TwoStartedPlansAndAWorker(StoryFixture):
    """Plans 1, Shop, with tasks 1 and 2, and 2, Depot, with tasks 3 and 4, started in that order, and a worker,
    agent number 2, beside the main agent: story.worker."""

    parent = UserBuilder

    def steps(self, story: Story) -> None:
        for plan_id, title in enumerate(("Shop", "Depot"), 1):
            started_plan(story, plan_id, title)
        story.worker = Actor(story.new_row_id(f"agent start s-2 claude worker --parent {story.agent.id} --environment main"), ActorType.AGENT)

    def expect(self, story: Story) -> None:
        story.expect_success("plan show 2", "state: started")


def test_w1_the_default_focus_of_a_worker_is_the_oldest_started_plan_with_a_task_assigned_to_it(new_story):
    story = new_story(fixture=TwoStartedPlansAndAWorker)
    for task_id in (3, 4):
        story.run(f"task assign {task_id} --to {WORKER_NUMBER}", actor=story.agent)
    story.expect_success(PLAN_FOCUS, f"plan 2 is your focus: {DEFAULT_FOCUS}", "plan 1: has no task you can take", actor=story.worker)
    story.expect_success(PLAN_FOCUS, f"plan 1 is your focus: {DEFAULT_FOCUS}", "plan 2: has no task you can take", actor=story.agent)


def test_w14_a_phase_a_person_assigns_to_a_worker_becomes_its_default_focus_and_is_not_handed_to_the_main_agent(new_story):
    story = new_story(fixture=TwoStartedPlansAndAWorker)
    story.run(f"plan assign 2 --phase 2 --to {WORKER_NUMBER} --environment main", actor=story.user)
    story.expect_success(PLAN_FOCUS, f"plan 2 is your focus: {DEFAULT_FOCUS}", actor=story.worker)
    for task_id in (1, 2):
        story.run(f"task start {task_id}", actor=story.agent)
        story.run(f'task close {task_id} --outcome "done"', actor=story.agent)
    story.run_listeners()
    story.expect_success("task show 3", "state: open")
    story.expect_success(PLAN_FOCUS, "no started plan has work you can take", "plan 2: has no task you can take", actor=story.agent)
