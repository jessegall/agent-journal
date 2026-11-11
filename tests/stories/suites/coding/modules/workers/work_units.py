import json

from suites.coding.modules.workers.migrations.m072_plan_worker_backfill import PlanWorkerBackfillMigration
from engine.database.statement import Statement
from engine.database.database import Database
from suites.coding.modules.workers.support.work_units import WorkUnits
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.suites.coding.modules.workers.support.phase_steps import PHASE_DISPATCH, start_planned_worker, unplanned_group_worker


def unit_of(worker):
    return worker.story.container.get(WorkUnits).unit(worker.worker.id)


def test_tasks_sent_together_are_one_list_unit(new_story, monkeypatch):
    worker = unplanned_group_worker(new_story, monkeypatch)
    sent = unit_of(worker)
    worker.story.expect_rows(sent.task_ids == (1, 2, 3), sent.plan is None, sent.phase is None, not sent.is_single, sent.uncommitted_count == 3, detail=str(sent))


def test_a_phase_of_a_plan_worked_by_another_agent_is_the_unit_and_a_plan_assigned_to_the_worker_is_the_unit(new_story, monkeypatch):
    worker = start_planned_worker(new_story, monkeypatch, PHASE_DISPATCH)
    by_phase = unit_of(worker)
    worker.story.expect_success(f"plan assign 1 --to {agent_number(worker.story, worker.worker.id)} --environment main", actor=worker.story.user)
    by_plan = unit_of(worker)
    worker.story.expect_rows(by_phase.plan is None, by_phase.phase is not None and by_phase.phase.id == 1, by_phase.task_ids == (1, 2, 3),
                             by_plan.plan is not None and by_plan.plan.id == 1, by_plan.phase is None, detail=f"{by_phase} / {by_plan}")


def test_a_unit_counts_what_is_not_committed_and_is_committed_once_every_task_is(new_story, monkeypatch):
    worker = unplanned_group_worker(new_story, monkeypatch)
    worker.prove_commit()
    after_one = unit_of(worker)
    worker.story.expect_rows(after_one.uncommitted_count == 2, not after_one.is_committed, detail=str(after_one))


def test_the_status_of_a_plan_worker_opens_with_its_unit_and_its_build_line_names_what_is_left(new_story, monkeypatch):
    worker = start_planned_worker(new_story, monkeypatch)
    status = worker.status()
    name_line = unit_of(worker).name_line
    worker.story.expect_rows(status.splitlines()[1] == "Unit: plan 1, Rebuild the cart. 4 of 4 tasks left; nothing merged yet.", "4 left in your unit" in status,
                             name_line == "Your unit is plan 1, Rebuild the cart: 4 tasks. Work all of it before you report.", detail=f"{status} / {name_line}")


def test_the_plan_card_names_the_worker_that_works_the_plan_and_no_agent_before_one_is_assigned(new_story, monkeypatch):
    worker = start_planned_worker(new_story, monkeypatch, PHASE_DISPATCH)
    before = plan_card(worker)
    worker.story.expect_success(f"plan assign 1 --to {agent_number(worker.story, worker.worker.id)} --environment main", actor=worker.story.user)
    after = plan_card(worker)
    worker.story.expect_rows(before["assignee"] is None, after["assignee"] is not None and after["assignee"]["id"] == worker.worker.id, detail=f"{before} / {after}")


def plan_card(worker):
    board = json.loads(worker.story.run("plan board --environment main --json", actor=worker.story.user).output_text)
    return next(card for card in board["plans"] if card["id"] == 1)


def test_a_plan_dispatched_before_dispatch_named_its_worker_gets_its_worker_from_the_upgrade(new_story, monkeypatch):
    worker = start_planned_worker(new_story, monkeypatch)
    database = worker.story.container.get(Database)
    database.update(Statement("UPDATE plans SET metadata = '{}', version = version + 1 WHERE id = 1"))
    before = unit_of(worker)
    PlanWorkerBackfillMigration().run(database)
    card = plan_card(worker)
    worker.story.expect_rows(before.plan is None, card["assignee"] is not None and card["assignee"]["id"] == worker.worker.id, detail=str(card))
