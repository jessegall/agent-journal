import pytest

from engine.testing.stories.story_fixture import StoryFixture

from datetime import timedelta

from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import OpenTaskBuilder, StartedTaskBuilder
from tests.stories.suites.coding.support.task_expectations import expect_started_task_count
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.core.support.plan_steps import ready_plan


# task 3 then task 2 sit in plan 1's first phase; task 4 is outside any plan and most urgent
def planned_tasks(story, *, started: bool) -> None:
    UserJoined().steps(story)
    story.run('plan make "The rebuild" --brief "all of it" --environment main', actor=story.agent)
    story.run('phase make --plan 1 "First" --goal "it works"', actor=story.agent)
    story.run('task make "Second in the plan" --environment main', actor=story.agent)
    story.run('task make "Third in the plan" --environment main', actor=story.agent)
    story.run("phase place 3 --phase 1", actor=story.agent)
    story.run("phase place 2 --phase 1", actor=story.agent)
    story.run('task make "Outside the plan" --environment main --priority high', actor=story.agent)
    if started:
        ready_plan(story, actor=story.user)
        for move in ("plan approve 1", "plan start 1"):
            story.run(f"{move} --environment main", actor=story.user)


def test_a_task_leaving_the_hands_is_followed_by_the_started_plans_first_task_in_the_order_of_its_phase(next_plan_task):
    story = next_plan_task
    story.expect_text("task show 3", "state: started", actor=story.agent)
    story.expect_text("task show 2", "state: open", actor=story.agent)
    story.expect_text("task show 4", "state: open", actor=story.agent)


def test_a_critical_task_outside_the_plan_goes_before_the_started_plan(new_story):
    story = new_story(fixture=StartedPlanTasks)
    story.run("task edit 4 --priority critical", actor=story.agent)
    story.run('task close 1 --outcome "done"', actor=story.agent)
    story.run_listeners()
    story.expect_text("task show 4", "state: started", actor=story.agent)


def test_a_task_above_high_goes_before_the_started_plan_and_a_high_task_does_not(urgent_plan_task):
    story = urgent_plan_task
    story.expect_text("task show 5", "state: started", actor=story.agent)
    story.expect_text("task show 2", "state: open", actor=story.agent)
    story.expect_text("task show 4", "state: open", actor=story.agent)


def test_a_critical_task_goes_before_a_task_above_high(new_story):
    story = new_story(fixture=UrgentTaskPlan)
    story.run('task make "Fire" --environment main --priority critical', actor=story.agent)
    story.run('task close 1 --outcome "done"', actor=story.agent)
    story.run_listeners()
    story.expect_text("task show 6", "state: started", actor=story.agent)
    story.expect_text("task show 5", "state: open", actor=story.agent)


def test_a_later_phase_waits_until_the_earlier_phase_is_finished(new_story):
    story = new_story(fixture=StartedTaskBuilder)
    UserJoined().steps(story)
    story.run('plan make "The rebuild" --brief "all of it" --environment main', actor=story.agent)
    story.run('phase make --plan 1 "First" --goal "it works"', actor=story.agent)
    story.run('phase make --plan 1 "Second" --goal "it ships"', actor=story.agent)
    story.run('task make "Held up" --environment main', actor=story.agent)
    story.run('task make "Urgent but later" --environment main --priority high', actor=story.agent)
    story.run("phase place 2 --phase 1", actor=story.agent)
    story.run("phase place 3 --phase 2", actor=story.agent)
    story.run('task block 2 --reason "waits for the price list"', actor=story.user)
    ready_plan(story, actor=story.user)
    for move in ("plan approve 1", "plan start 1"):
        story.run(f"{move} --environment main", actor=story.user)
    story.run('task close 1 --outcome "done"', actor=story.agent)
    story.run_listeners()
    story.expect_text("task show 3", "state: open", actor=story.agent)


def test_a_stop_with_empty_hands_is_handed_the_started_plans_next_task(new_story):
    story = new_story(fixture=OpenTaskBuilder)
    story.run('task cancel 1 --reason "not needed"', actor=story.agent)
    planned_tasks(story, started=True)
    story.run('task release 3 --reason "later"', actor=story.agent)
    story.expect_hook_refusal("s-1", HookSamples.stop(), "task")
    expect_started_task_count(story, (2, 3), 1)
    story.expect_text("task show 4", "state: open", actor=story.agent)


def test_the_tasks_of_a_plan_not_yet_started_are_never_handed_out(new_story):
    story = new_story(fixture=UnstartedPlanTasks)
    story.run('task close 1 --outcome "done"', actor=story.agent)
    story.run_listeners()
    story.expect_text("task show 4", "state: started", actor=story.agent)
    story.expect_text("task show 2", "state: open", actor=story.agent)
    story.expect_text("task show 3", "state: open", actor=story.agent)


def test_when_the_plan_has_nothing_free_the_next_task_outside_it_is_handed_out(new_story):
    story = new_story(fixture=StartedPlanTasks)
    story.run("task depend 3 --on 4", actor=story.agent)
    story.run("task depend 2 --on 4", actor=story.agent)
    story.run('task close 1 --outcome "done"', actor=story.agent)
    story.run_listeners()
    story.expect_text("task show 4", "state: started", actor=story.agent)


def test_of_two_started_plans_the_one_started_first_goes_first(new_story):
    story = new_story(fixture=StartedTaskBuilder)
    UserJoined().steps(story)
    for plan_id, title in ((1, "Made first"), (2, "Made second")):
        story.run(f'plan make "{title}" --brief "all of it" --environment main', actor=story.agent)
        story.run(f'phase make --plan {plan_id} "First" --goal "it works"', actor=story.agent)
        story.run(f'task make "Task of {title}" --environment main', actor=story.agent)
        story.run(f"phase place {plan_id + 1} --phase {plan_id}", actor=story.agent)
        ready_plan(story, plan_id, actor=story.user)
        story.run(f"plan approve {plan_id} --environment main", actor=story.user)
    story.run("plan start 2")
    story.advance(timedelta(seconds=1))
    story.run("plan start 1")
    story.run('task close 1 --outcome "done"', actor=story.agent)
    story.run_listeners()
    story.expect_text("task show 3", "state: started", actor=story.agent)
    story.expect_text("task show 2", "state: open", actor=story.agent)


class StartedPlanTasks(StoryFixture):
    parent = StartedTaskBuilder

    def steps(self, story):
        planned_tasks(story, started=True)


class UrgentTaskPlan(StoryFixture):
    parent = StartedPlanTasks

    def steps(self, story):
        story.run('task make "Just above high" --environment main --priority 301', actor=story.agent)


@pytest.fixture
def next_plan_task(new_story):
    story = new_story(fixture=StartedPlanTasks)
    story.run('task close 1 --outcome "done"', actor=story.agent)
    story.run_listeners()
    return story


@pytest.fixture
def urgent_plan_task(new_story):
    story = new_story(fixture=UrgentTaskPlan)
    story.run('task close 1 --outcome "done"', actor=story.agent)
    story.run_listeners()
    return story


class UnstartedPlanTasks(StoryFixture):
    parent = StartedTaskBuilder

    def steps(self, story):
        planned_tasks(story, started=False)
