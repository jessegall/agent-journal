import json

import pytest

from tests.stories.suites.coding.modules.workers.support.phase_steps import group_worker, pair_worker, phase_worker, planned_worker  # noqa: F401
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.suites.coding.modules.workers.support.phase_steps import unplanned_group_worker
from tests.integration.suites.coding.modules.workers.test_work_units import plan_card, worker_unit
from tests.stories.support.story_checks import expect_value, expect_value_4, expect_value_with

"""Book A of doc 1252: the unit a worker is given is assigned and seen so."""


def number_of(worker) -> int:
    return agent_number(worker.story, worker.worker.id)


def test_01_a_dispatch_on_a_plan_assigns_the_plan(planned_worker):
    planned_worker.story.expect_rows(worker_unit(planned_worker).plan is not None and worker_unit(planned_worker).plan.id == 1)


def test_02_a_send_on_a_plan_assigns_it_to_a_kept_worker(phase_worker):
    phase_worker.story.expect_success(f"worker send {number_of(phase_worker)} --plan 1 --phase 2", actor=phase_worker.story.agent)
    phase_worker.story.expect_rows(worker_unit(phase_worker).phase is None or worker_unit(phase_worker).phase.id != 0)


def test_03_a_dispatch_on_a_phase_assigns_that_phases_tasks_only(phase_worker):
    unit = worker_unit(phase_worker)
    phase_worker.story.expect_rows(unit.plan is None, unit.phase is not None and unit.phase.id == 1, unit.task_ids == (1, 2, 3), detail=str(unit))


def test_04_a_dispatch_of_several_tasks_is_one_unit(new_story):
    unit = worker_unit(unplanned_group_worker(new_story))
    unit_text = unit.status_line
    expect_value_4(unit.has_several_tasks and unit_text.startswith("Unit: tasks 1, 2, 3"))


def test_05_a_dispatch_of_one_task_is_a_unit_of_one(pair_worker):
    pair_worker.story.expect_success(f"worker send {number_of(pair_worker)} --task 2", actor=pair_worker.story.agent)
    expect_value_4(not worker_unit(pair_worker).is_single or worker_unit(pair_worker).status_line == "")


def test_06_the_brief_names_the_unit(planned_worker):
    expect_value(worker_unit(planned_worker).name_line, "Your unit is plan 1, Rebuild the cart: 4 tasks. Work all of it before you report.")


def test_07_the_status_names_the_unit_under_the_point(planned_worker):
    status = planned_worker.status()
    planned_worker.story.expect_rows(status.splitlines()[1].startswith("Unit: plan 1, Rebuild the cart."), detail=f"the unit under the point: {status}")


@pytest.mark.xfail(strict=True, reason="task 9016: the generic agent list takes no line from a module yet")
def test_08_the_main_agent_sees_each_workers_unit_in_the_agent_list(planned_worker):
    planned_worker.story.expect_text("agent list --role worker --environment main", "plan 1", actor=planned_worker.story.agent)


@pytest.mark.xfail(strict=True, reason="task 9016: the generic plan list takes no column from a module yet")
def test_09_the_plan_list_shows_who_works_each_plan(planned_worker):
    planned_worker.story.expect_text("plan list --environment main", f"worker {number_of(planned_worker)}", actor=planned_worker.story.user)


def test_10_the_person_sees_the_worker_on_the_plan_card(planned_worker):
    card = plan_card(planned_worker)
    planned_worker.story.expect_rows(card["assignee"]["id"] == planned_worker.worker.id, detail=str(card))


def test_11_the_person_sees_the_unit_on_the_agent_card(planned_worker):
    listed = json.loads(planned_worker.story.run("usage agents --environment main --json", actor=planned_worker.story.user).output_text)
    expect_value(next(row for row in listed["rows"] if row["id"] == planned_worker.worker.id)["unit_name"], "Plan 1 · Rebuild the cart")


def test_12_a_second_worker_on_a_worked_plan_is_refused(planned_worker):
    planned_worker.story.run('task make "Receipts" --environment main', actor=planned_worker.story.agent)
    planned_worker.story.run("phase place 5 --phase 2", actor=planned_worker.story.agent)
    planned_worker.story.expect_refusal("worker dispatch --test-command python=pytest --model sonnet --plan 1", f"plan 1 is worked by worker {number_of(planned_worker)}", actor=planned_worker.story.agent)


def test_13_a_plan_not_approved_or_started_is_refused(pair_worker):
    pair_worker.story.run('plan make "Drafts" --environment main', actor=pair_worker.story.agent)
    pair_worker.story.expect_refusal(f"worker send {number_of(pair_worker)} --plan 1", "only an approved or started plan goes to a worker", actor=pair_worker.story.agent)


def test_14_a_send_onto_an_open_unit_joins_it(group_worker):
    task_id = group_worker.story.new_row_id('task make "Receipts" --brief "Print them"', actor=group_worker.story.agent)
    group_worker.story.expect_success(f"worker send {number_of(group_worker)} --task {task_id}", actor=group_worker.story.agent)
    expect_value_with(worker_unit(group_worker).task_ids, task_id)


def test_15_a_released_worker_leaves_the_plan_to_the_main_agent(planned_worker):
    planned_worker.story.expect_success(f'worker release {number_of(planned_worker)} "not needed"', actor=planned_worker.story.agent)
    expect_value_4(plan_card(planned_worker)["assignee"] is None or plan_card(planned_worker)["assignee"]["id"] != planned_worker.worker.id)


def test_16_a_finished_unit_keeps_its_plan_named_until_the_merge(planned_worker):
    planned_worker.prove_commit()
    expect_value(plan_card(planned_worker)["assignee"]["id"], planned_worker.worker.id)
