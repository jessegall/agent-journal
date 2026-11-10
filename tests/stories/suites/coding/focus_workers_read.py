from engine.actor.actor import Actor
from engine.testing.stories.story import Story
from tests.stories.core.modules.agents.support.numbered_agents import agent_numbers
from tests.stories.core.modules.plans.support.started_plans import DEFAULT_FOCUS, PLAN_FOCUS
from tests.stories.core.support.plan_steps import ready_plan
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker
from tests.stories.suites.coding.modules.workers.support.phase_steps import planned_story

DEPOT_PHASES = {"Build": 3, "Ship": 4}


def two_started_plans_and_a_worker(new_story) -> tuple[Story, Actor, int]:
    """Plan 1, Rebuild the cart, and plan 2, Depot, with a task in each of its phases Build (3) and Ship (4),
    started in that order, and a worker dispatched on a job outside both; gives the worker and its number."""
    story = planned_story(new_story)
    story.run("plan start 1 --environment main", actor=story.user)
    story.run('plan make "Depot" --environment main', actor=story.user)
    for title, phase_id in DEPOT_PHASES.items():
        story.run(f'phase make --plan 2 "{title}"', actor=story.user)
        task_id = story.new_row_id(f'task make "Depot {title.lower()}" --environment main', actor=story.user)
        story.run(f"phase place {task_id} --phase {phase_id}", actor=story.user)
    ready_plan(story, 2, actor=story.user)
    for move in ("approve", "start"):
        story.run(f"plan {move} 2 --environment main", actor=story.user)
    job_id = story.new_row_id('task make "Worker job" --environment main', actor=story.agent)
    worker = dispatched_worker(story, f"worker dispatch --test-command python=pytest --model sonnet {job_id}")
    return story, worker, agent_numbers(story)[worker.id]


def test_w1_w14_a_phase_assigned_to_a_worker_is_its_default_focus_and_the_main_agent_keeps_its_own(new_story):
    story, worker, number = two_started_plans_and_a_worker(new_story)
    story.expect_success(f"plan assign 2 --phase {DEPOT_PHASES['Build']} --to {number} --environment main", actor=story.user)
    story.expect_success(PLAN_FOCUS, f"plan 2 is your focus: {DEFAULT_FOCUS}", "plan 1: has no task you can take", actor=worker)
    story.expect_success(PLAN_FOCUS, f"plan 1 is your focus: {DEFAULT_FOCUS}", actor=story.agent)
    for task_id in (1, 2, 3, 4):
        story.run(f"task start {task_id}", actor=story.agent)
        story.run(f'task close {task_id} --outcome "done"', actor=story.agent)
    story.expect_success(PLAN_FOCUS, "no started plan has work you can take", actor=story.agent)
