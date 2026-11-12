import json

import pytest

from tests.stories.core.modules.assignments.support.assignment_reads import assigned, assignment_of, logged_events, row_actors
from tests.stories.core.modules.plans.support.assigned_plans import PlanWithTwoPhases, phase_task_ids, plan_worker

ALL_TASKS = [*phase_task_ids(1), *phase_task_ids(2)]
HAND_GIVEN_TASK = 2
CLOSED_TASK = 6


@pytest.fixture
def plan(new_story):
    return new_story(fixture=PlanWithTwoPhases)


def worker_id(story, position: int) -> int:
    return plan_worker(story, position).id


def test_assigning_a_plan_assigns_its_phases_and_its_open_and_blocked_tasks_not_closed_ones_in_one_command_and_prints_the_counts_and_kept(plan):
    plan.expect_success(f'task cancel {CLOSED_TASK} --reason "not needed" --environment main', actor=plan.user)
    summary = assigned(plan, "plan 1", worker_id(plan, 1))
    plan.expect_rows(row_actors(plan, "phase") == {1: worker_id(plan, 1), 2: worker_id(plan, 1)}, sorted(row_actors(plan, "task")) == [1, 2, 3, 4, 5],
                     "assigned 1 plan, 2 phases, 5 tasks" in summary, "kept 1 task" in summary, detail=summary)


def test_cascaded_rows_carry_via_id_and_hand_given_rows_do_not(plan):
    assigned(plan, "plan 1", worker_id(plan, 1))
    plan_row, phase_row, task_row = assignment_of(plan, "plan", 1), assignment_of(plan, "phase", 1), assignment_of(plan, "task", 1)
    plan.expect_rows(plan_row["source_id"] is None, phase_row["source_id"] == plan_row["id"], task_row["source_id"] == phase_row["id"], detail=str([plan_row, phase_row, task_row]))
    plan.expect_text(f"assignment show {task_row['id']} --environment main", f"source_id: {phase_row['id']}", actor=plan.user)


def test_assigning_one_task_to_v_by_hand_leaves_the_plan_the_phases_and_other_tasks_with_w(plan):
    assigned(plan, f"task {HAND_GIVEN_TASK}", worker_id(plan, 2))
    assigned(plan, "plan 1", worker_id(plan, 1))
    tasks = row_actors(plan, "task")
    plan.expect_rows(tasks[HAND_GIVEN_TASK] == worker_id(plan, 2), all(tasks[task_id] == worker_id(plan, 1) for task_id in ALL_TASKS if task_id != HAND_GIVEN_TASK),
                     row_actors(plan, "plan") == {1: worker_id(plan, 1)}, detail=str(tasks))
    plan.expect_text(f"task info {HAND_GIVEN_TASK} --environment main", f"assigned to: agent {worker_id(plan, 2)}", actor=plan.agent)


def test_assigning_the_plan_to_x_moves_inherited_rows_and_keeps_the_task_given_to_v_and_says_so(plan):
    assigned(plan, "plan 1", worker_id(plan, 1))
    assigned(plan, f"task {HAND_GIVEN_TASK}", worker_id(plan, 2))
    summary = assigned(plan, "plan 1", worker_id(plan, 3))
    tasks = row_actors(plan, "task")
    plan.expect_rows(tasks[HAND_GIVEN_TASK] == worker_id(plan, 2), all(tasks[task_id] == worker_id(plan, 3) for task_id in ALL_TASKS if task_id != HAND_GIVEN_TASK),
                     "kept 1 task (given by hand)" in summary, detail=summary)
    plan.expect_success("plan outline 1 --environment main", actor=plan.agent)


def test_override_takes_the_hand_given_task_too(plan):
    assigned(plan, f"task {HAND_GIVEN_TASK}", worker_id(plan, 2))
    summary = assigned(plan, "plan 1", worker_id(plan, 3), "--override")
    taken = assignment_of(plan, "task", HAND_GIVEN_TASK)
    plan.expect_rows(taken["actor_id"] == worker_id(plan, 3), taken["source_id"] == assignment_of(plan, "phase", 1)["id"], "kept" not in summary, detail=summary)
    plan.expect_success(f"task show {HAND_GIVEN_TASK} --environment main", actor=plan.agent)


def test_from_parent_gives_a_task_back_to_its_phases_actor(plan):
    assigned(plan, "phase 1", worker_id(plan, 1))
    assigned(plan, f"task {HAND_GIVEN_TASK}", worker_id(plan, 2))
    plan.expect_success(f"assign task {HAND_GIVEN_TASK} --from-parent --environment main", actor=plan.user)
    inherited = assignment_of(plan, "task", HAND_GIVEN_TASK)
    plan.expect_rows(inherited["actor_id"] == worker_id(plan, 1), inherited["source_id"] == assignment_of(plan, "phase", 1)["id"], detail=str(inherited))


def test_assigning_a_phase_assigns_only_its_tasks_and_never_changes_the_plans_assignee(plan):
    assigned(plan, "phase 2", worker_id(plan, 2))
    plan.expect_rows(row_actors(plan, "plan") == {}, sorted(row_actors(plan, "task")) == phase_task_ids(2), row_actors(plan, "phase") == {2: worker_id(plan, 2)},
                     detail=str(row_actors(plan, "task")))
    plan.expect_success("plan board --json --environment main", actor=plan.user)


def test_unassigning_the_plan_removes_plan_phases_and_inherited_tasks_and_keeps_hand_given_ones(plan):
    assigned(plan, f"task {HAND_GIVEN_TASK}", worker_id(plan, 3))
    assigned(plan, "plan 1", worker_id(plan, 1))
    plan.expect_success("unassign plan 1 --environment main", actor=plan.user)
    plan.expect_rows(row_actors(plan, "plan") == {}, row_actors(plan, "phase") == {}, row_actors(plan, "task") == {HAND_GIVEN_TASK: worker_id(plan, 3)},
                     detail=str(row_actors(plan, "task")))
    plan.expect_text("task info 1 --environment main", "assigned to: nobody", actor=plan.user)


def test_unassigning_a_hand_given_task_leaves_it_unassigned(plan):
    assigned(plan, "task 4", worker_id(plan, 3))
    plan.expect_success("unassign task 4 --environment main", actor=plan.user)
    plan.expect_rows(row_actors(plan, "task") == {}, detail=str(row_actors(plan, "task")))


def test_each_child_assignment_is_its_own_event_caused_by_the_command_event(plan):
    assigned(plan, "plan 1", worker_id(plan, 2), "--override")
    created = logged_events(plan, "assignment.create")
    plan.expect_rows(len(created) == 9, len({event["command"] for event in created}) == 1, len({event["cause_id"] for event in created}) == 1, detail=str(created))


def test_a_phase_has_one_actor_and_carries_its_tasks(plan):
    assigned(plan, "phase 1", worker_id(plan, 3))
    assigned(plan, "phase 1", worker_id(plan, 2))
    plan.expect_rows(row_actors(plan, "phase") == {1: worker_id(plan, 2)}, all(row_actors(plan, "task")[task_id] == worker_id(plan, 2) for task_id in phase_task_ids(1)),
                     detail=str(row_actors(plan, "task")))
    plan.expect_success("phase show 1 --environment main", actor=plan.user)


def test_a_plan_has_one_actor_and_carries_its_phases(plan):
    assigned(plan, "plan 1", worker_id(plan, 3), "--override")
    assigned(plan, "plan 1", worker_id(plan, 1), "--override")
    plan.expect_rows(row_actors(plan, "plan") == {1: worker_id(plan, 1)}, row_actors(plan, "phase") == {1: worker_id(plan, 1), 2: worker_id(plan, 1)},
                     detail=str(row_actors(plan, "phase")))
    plan.expect_success("plan show 1 --environment main", actor=plan.user)


def test_plan_inspect_shows_the_assignee(plan):
    assigned(plan, "plan 1", worker_id(plan, 1), "--no-cascade")
    inspected = json.loads(plan.run("plan inspect 1 --json", actor=plan.agent).output_text)
    plan.expect_rows(inspected["assignee"] is not None and inspected["assignee"]["id"] == worker_id(plan, 1), detail=str(inspected["assignee"]))
