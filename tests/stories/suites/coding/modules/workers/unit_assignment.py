import json

import pytest

from tests.stories.core.support.agent_labels import agent_number
from tests.stories.suites.coding.modules.workers.support.phase_steps import EXTERNAL_DISPATCH, PHASE_DISPATCH, start_planned_worker, unplanned_group_worker, unplanned_worker
from tests.stories.suites.coding.modules.workers.work_units import plan_card, unit_of

"""Book A of doc 1252: the unit a worker is given is assigned and seen so."""


def number_of(worker) -> int:
    return agent_number(worker.story, worker.worker.id)


def test_01_a_dispatch_on_a_plan_assigns_the_plan(new_story, monkeypatch):
    worker = start_planned_worker(new_story, monkeypatch)
    worker.story.expect_rows(unit_of(worker).plan is not None and unit_of(worker).plan.id == 1)


def test_02_a_send_on_a_plan_assigns_it_to_a_kept_worker(new_story, monkeypatch):
    worker = start_planned_worker(new_story, monkeypatch, PHASE_DISPATCH)
    worker.story.expect_success(f"worker send {number_of(worker)} --plan 1 --phase 2", actor=worker.story.agent)
    worker.story.expect_rows(unit_of(worker).phase is None or unit_of(worker).phase.id != 0)


def test_03_a_dispatch_on_a_phase_assigns_that_phases_tasks_only(new_story, monkeypatch):
    worker = start_planned_worker(new_story, monkeypatch, PHASE_DISPATCH)
    unit = unit_of(worker)
    worker.story.expect_rows(unit.plan is None, unit.phase is not None and unit.phase.id == 1, unit.task_ids == (1, 2, 3), detail=str(unit))


def test_04_a_dispatch_of_several_tasks_is_one_unit(new_story, monkeypatch):
    unit = unit_of(unplanned_group_worker(new_story, monkeypatch))
    unit_text = unit.status_line
    assert unit.has_several_tasks and unit_text.startswith("Unit: tasks 1, 2, 3"), unit_text


def test_05_a_dispatch_of_one_task_is_a_unit_of_one(new_story, monkeypatch):
    worker = unplanned_worker(new_story, monkeypatch)
    worker.story.expect_success(f"worker send {number_of(worker)} --task 2", actor=worker.story.agent)
    assert not unit_of(worker).is_single or unit_of(worker).status_line == ""


def test_06_the_brief_names_the_unit(new_story, monkeypatch):
    worker = start_planned_worker(new_story, monkeypatch)
    assert unit_of(worker).name_line == "Your unit is plan 1, Rebuild the cart: 4 tasks. Work all of it before you report."


def test_07_the_status_names_the_unit_under_the_point(new_story, monkeypatch):
    worker = start_planned_worker(new_story, monkeypatch)
    assert worker.status().splitlines()[1].startswith("Unit: plan 1, Rebuild the cart.")


@pytest.mark.xfail(strict=True, reason="task 9016: the generic agent list takes no line from a module yet")
def test_08_the_main_agent_sees_each_workers_unit_in_the_agent_list(new_story, monkeypatch):
    worker = start_planned_worker(new_story, monkeypatch)
    worker.story.expect_text("agent list --role worker --environment main", "plan 1", actor=worker.story.agent)


@pytest.mark.xfail(strict=True, reason="task 9016: the generic plan list takes no column from a module yet")
def test_09_the_plan_list_shows_who_works_each_plan(new_story, monkeypatch):
    worker = start_planned_worker(new_story, monkeypatch)
    worker.story.expect_text("plan list --environment main", f"worker {number_of(worker)}", actor=worker.story.user)


def test_10_the_person_sees_the_worker_on_the_plan_card(new_story, monkeypatch):
    worker = start_planned_worker(new_story, monkeypatch)
    assert plan_card(worker)["assignee"]["id"] == worker.worker.id


def test_11_the_person_sees_the_unit_on_the_agent_card(new_story, monkeypatch):
    worker = start_planned_worker(new_story, monkeypatch)
    listed = json.loads(worker.story.run("usage agents --environment main --json", actor=worker.story.user).output_text)
    assert next(row for row in listed["rows"] if row["id"] == worker.worker.id)["unit_name"] == "Plan 1 · Rebuild the cart"


def test_12_a_second_worker_on_a_worked_plan_is_refused(new_story, monkeypatch):
    worker = start_planned_worker(new_story, monkeypatch)
    worker.story.run('task make "Receipts" --environment main', actor=worker.story.agent)
    worker.story.run("phase place 5 --phase 2", actor=worker.story.agent)
    worker.story.expect_refusal("worker dispatch --test-command python=pytest --model sonnet --plan 1", f"plan 1 is worked by worker {number_of(worker)}", actor=worker.story.agent)


def test_13_a_plan_not_approved_or_started_is_refused(new_story, monkeypatch):
    worker = unplanned_worker(new_story, monkeypatch)
    worker.story.run('plan make "Drafts" --environment main', actor=worker.story.agent)
    worker.story.expect_refusal(f"worker send {number_of(worker)} --plan 1", "only an approved or started plan goes to a worker", actor=worker.story.agent)


@pytest.mark.xfail(strict=True, reason="plan 1119: a task sent onto an open unit joins it")
def test_14_a_send_onto_an_open_unit_joins_it(new_story, monkeypatch):
    worker = unplanned_group_worker(new_story, monkeypatch)
    task_id = worker.story.new_row_id('task make "Receipts" --brief "Print them"', actor=worker.story.agent)
    worker.story.expect_success(f"worker send {number_of(worker)} --task {task_id}", actor=worker.story.agent)
    assert task_id in unit_of(worker).task_ids


def test_15_a_released_worker_leaves_the_plan_to_the_main_agent(new_story, monkeypatch):
    worker = start_planned_worker(new_story, monkeypatch)
    worker.story.expect_success(f'worker release {number_of(worker)} "not needed"', actor=worker.story.agent)
    assert plan_card(worker)["assignee"] is None or plan_card(worker)["assignee"]["id"] != worker.worker.id


def test_16_a_finished_unit_keeps_its_plan_named_until_the_merge(new_story, monkeypatch):
    worker = start_planned_worker(new_story, monkeypatch)
    worker.prove_commit()
    assert plan_card(worker)["assignee"]["id"] == worker.worker.id
