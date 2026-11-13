import pytest

from tests.stories.core.modules.assignments.support.assignment_reads import assigned, row_actors
from tests.stories.core.modules.plans.support.assigned_plans import PlanWithTwoPhases, phase_task_ids, plan_worker
from tests.stories.core.support.agent_labels import agent_number
from suites.coding.support.coding_settings import WRITES_CODE_SETTING

WRITES_CODE = f"{WRITES_CODE_SETTING}"
NEW_TASK = 7


@pytest.fixture
def plan(new_story):
    return new_story(fixture=PlanWithTwoPhases)


def worker_id(story, position: int) -> int:
    return plan_worker(story, position).id


def test_a_task_added_to_a_phase_of_an_assigned_plan_is_given_the_phases_actor(plan):
    assigned(plan, "plan 1", worker_id(plan, 1))
    plan.expect_success(f'task make "Task {NEW_TASK}" --brief "A later task" --environment main', actor=plan.agent)
    plan.expect_success(f"phase place {NEW_TASK} --phase 1", actor=plan.agent)
    plan.expect_rows(row_actors(plan, "task").get(NEW_TASK) == worker_id(plan, 1), detail=str(row_actors(plan, "task")))


def test_a_phase_added_to_an_assigned_plan_is_given_the_plans_actor(plan):
    assigned(plan, "plan 1", worker_id(plan, 2))
    plan.expect_success('phase make --plan 1 "Phase 3"', actor=plan.user)
    plan.expect_rows(row_actors(plan, "phase").get(3) == worker_id(plan, 2), detail=str(row_actors(plan, "phase")))


def test_a_task_moved_to_another_phase_keeps_a_hand_given_assignment_and_takes_the_new_phases_actor_if_inherited(plan):
    assigned(plan, "phase 1", worker_id(plan, 1))
    assigned(plan, "phase 2", worker_id(plan, 2))
    assigned(plan, "task 2", worker_id(plan, 3))
    for task_id in (1, 2):
        plan.expect_success(f"phase place {task_id} --phase 2", actor=plan.agent)
    tasks = row_actors(plan, "task")
    plan.expect_rows(tasks.get(1) == worker_id(plan, 2), tasks.get(2) == worker_id(plan, 3), detail=str(tasks))


def test_a_task_removed_from_a_phase_loses_an_inherited_assignment_and_keeps_a_hand_given_one(plan):
    assigned(plan, "phase 1", worker_id(plan, 2))
    assigned(plan, "task 2", worker_id(plan, 3))
    for row_id in (1, 2):
        plan.expect_success(f"phase-task delete {row_id} --environment main", actor=plan.agent)
    tasks = row_actors(plan, "task")
    plan.expect_rows(1 not in tasks, tasks.get(2) == worker_id(plan, 3), detail=str(tasks))


def test_plan_assign_with_no_to_records_the_first_running_main_agent_and_leaves_the_tasks_free_and_runs_no_cascade(plan):
    plan.expect_success("plan assign 1 --environment main", actor=plan.agent)
    plan.expect_rows(row_actors(plan, "plan") == {1: plan.agent.id}, row_actors(plan, "phase") == {}, row_actors(plan, "task") == {}, detail=str(row_actors(plan, "plan")))


def test_a_main_agent_that_writes_no_code_takes_no_task_and_the_whole_plan_assign_is_refused_and_nothing_is_half_assigned(plan):
    plan.expect_success(f"setting set {WRITES_CODE} off --environment main")
    plan.expect_refusal(f"plan assign 1 --to {agent_number(plan, plan.agent.id)} --environment main", "goes to a worker", actor=plan.user)
    plan.expect_rows(row_actors(plan, "plan") == {}, row_actors(plan, "phase") == {}, row_actors(plan, "task") == {}, detail=str(row_actors(plan, "task")))


def test_a_closed_cancelled_or_completed_task_is_left_out_of_a_cascade_and_reopening_does_not_assign_it(plan):
    plan.expect_success('task cancel 6 --reason "not needed" --environment main', actor=plan.user)
    plan.expect_success("task start 5", actor=plan.agent)
    plan.expect_success('task close 5 --outcome "done"', actor=plan.agent)
    plan.expect_success("unassign task 5 --environment main", actor=plan.user)
    summary = assigned(plan, "plan 1", worker_id(plan, 1))
    plan.expect_success("task reopen 6 --environment main", actor=plan.user)
    tasks = row_actors(plan, "task")
    plan.expect_rows(5 not in tasks, 6 not in tasks, "kept 2 tasks" in summary, detail=f"{summary} / {tasks}")


def test_a_task_assigned_to_worker_w_and_not_started_is_never_given_to_another_actor_by_a_cascade(plan):
    assigned(plan, "task 2", worker_id(plan, 1))
    summary = assigned(plan, "plan 1", worker_id(plan, 3))
    plan.expect_rows(row_actors(plan, "task").get(2) == worker_id(plan, 1), "kept 1 task (given by hand)" in summary, detail=summary)
    plan.expect_success("task start 2", actor=plan_worker(plan, 1))


def test_a_started_task_held_by_another_actor_is_skipped_by_a_parents_cascade_not_taken_and_the_command_lists_it_as_kept(plan):
    plan.expect_success("task start 3", actor=plan_worker(plan, 2))
    summary = assigned(plan, "plan 1", worker_id(plan, 3))
    plan.expect_rows(row_actors(plan, "task").get(3) == worker_id(plan, 2), "kept 1 task" in summary, all(row_actors(plan, "task").get(task_id) == worker_id(plan, 3) for task_id in phase_task_ids(2)),
                     detail=summary)
