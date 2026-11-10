from tests.stories.core.modules.plans.support.started_plans import DEFAULT_FOCUS, PLAN_FOCUS
from tests.stories.suites.coding.support.focus_plans import DEPOT_PHASES, two_started_plans_and_a_worker

def test_w1_w14_a_phase_assigned_to_a_worker_is_its_default_focus_and_the_main_agent_keeps_its_own(new_story):
    story, worker, number = two_started_plans_and_a_worker(new_story)
    story.expect_success(f"plan assign 2 --phase {DEPOT_PHASES['Build']} --to {number} --environment main", actor=story.user)
    story.expect_success(PLAN_FOCUS, f"plan 2 is your focus: {DEFAULT_FOCUS}", "plan 1: has no task you can take", actor=worker)
    story.expect_success(PLAN_FOCUS, f"plan 1 is your focus: {DEFAULT_FOCUS}", actor=story.agent)
    for task_id in (1, 2, 3, 4):
        story.run(f"task start {task_id}", actor=story.agent)
        story.run(f'task close {task_id} --outcome "done"', actor=story.agent)
    story.expect_success(PLAN_FOCUS, "no started plan has work you can take", actor=story.agent)
