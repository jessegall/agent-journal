from tests.stories.core.support.agent_labels import agent_number
from tests.stories.core.modules.plans.support.started_plans import DEFAULT_FOCUS, PLAN_FOCUS
from tests.stories.suites.coding.support.focus_plans import DEPOT_PHASES, two_started_plans_and_a_worker
from tests.stories.suites.coding.support.hand_outs import next_task_id, outside_task, worker_next_task_id

SET_FOCUS = "plan {plan} is your focus: you set it"
CART_TASK, DEPOT_TASK = 2, 5


def test_a_worker_and_the_main_agent_each_have_a_focus_of_their_own_and_a_worker_takes_its_tasks_in_the_order_of_its_focus(new_story):
    story, worker, number = two_started_plans_and_a_worker(new_story)
    story.expect_success(f"plan assign 2 --phase {DEPOT_PHASES['Build']} --to {number} --environment main", actor=story.user)
    story.expect_success(PLAN_FOCUS, f"plan 2 is your focus: {DEFAULT_FOCUS}", "plan 1: has no task you can take", actor=worker)
    story.expect_success(PLAN_FOCUS, f"plan 1 is your focus: {DEFAULT_FOCUS}", actor=story.agent)
    story.expect_success("plan focus 1", SET_FOCUS.format(plan=1), actor=worker)
    story.expect_success("plan focus 2 --environment main", "the focus of the main agent:", SET_FOCUS.format(plan=2), actor=story.user)
    story.expect_success(PLAN_FOCUS, SET_FOCUS.format(plan=1), actor=worker)
    story.expect_success("plan focus --clear", "your focus is the default again", f"plan 2 is your focus: {DEFAULT_FOCUS}", actor=worker)
    story.expect_success(PLAN_FOCUS, SET_FOCUS.format(plan=2), actor=story.agent)
    story.expect_success(f"task assign {CART_TASK} --to {agent_number(story, worker.id)}", actor=story.agent)
    story.expect_rows(worker_next_task_id(story, worker) == CART_TASK, next_task_id(story) == 1)
    story.run("plan focus 2", actor=worker)
    story.expect_rows(worker_next_task_id(story, worker) == DEPOT_TASK)
    story.run("plan focus 1", actor=worker)
    story.run(f"task depend {CART_TASK} --on 3", actor=story.user)
    story.expect_rows(worker_next_task_id(story, worker) == DEPOT_TASK)
    loose = outside_task(story, "Loose job")
    story.expect_success(f"task assign {loose} --to {agent_number(story, worker.id)}", actor=story.agent)
    story.expect_rows(worker_next_task_id(story, worker) == loose)
