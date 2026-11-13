import json

from suites.coding.modules.workers.migrations.m072_plan_worker_backfill import PlanWorkerBackfillMigration
from engine.database.statement import Statement
from engine.database.database import Database
from suites.coding.modules.workers.support.work_units import WorkUnits
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.suites.coding.modules.workers.support.phase_steps import PHASE_DISPATCH, start_planned_worker, unplanned_group_worker


def worker_unit(worker):
    return worker.story.container.get(WorkUnits).unit(worker.worker.id)


def test_tasks_sent_together_are_one_list_unit(new_story, monkeypatch):
    worker = unplanned_group_worker(new_story, monkeypatch)
    delivered = worker_unit(worker)
    worker.story.expect_rows(delivered.task_ids == (1, 2, 3), delivered.plan is None, delivered.phase is None, not delivered.is_single, delivered.uncommitted_count == 3, detail=str(delivered))


def test_a_phase_of_a_plan_worked_by_another_agent_is_the_unit_and_a_plan_assigned_to_the_worker_is_the_unit(new_story, monkeypatch):
    worker = start_planned_worker(new_story, monkeypatch, PHASE_DISPATCH)
    by_phase = worker_unit(worker)
    worker.story.expect_success(f"plan assign 1 --to {agent_number(worker.story, worker.worker.id)} --environment main", actor=worker.story.user)
    by_plan = worker_unit(worker)
    worker.story.expect_rows(by_phase.plan is None, by_phase.phase is not None and by_phase.phase.id == 1, by_phase.task_ids == (1, 2, 3),
                             by_plan.plan is not None and by_plan.plan.id == 1, by_plan.phase is None, detail=f"{by_phase} / {by_plan}")


def test_a_unit_counts_what_is_not_committed_and_is_committed_once_every_task_is(new_story, monkeypatch):
    worker = unplanned_group_worker(new_story, monkeypatch)
    worker.prove_commit()
    after_single = worker_unit(worker)
    worker.story.expect_rows(after_single.uncommitted_count == 2, not after_single.is_committed, detail=str(after_single))


def test_the_status_of_a_plan_worker_opens_with_its_unit_and_its_build_line_names_what_is_left(new_story, monkeypatch):
    worker = start_planned_worker(new_story, monkeypatch)
    status = worker.status()
    name_line = worker_unit(worker).name_line
    worker.story.expect_rows(status.splitlines()[1] == "Unit: plan 1, Rebuild the cart. 4 of 4 tasks left; nothing merged yet.", "4 left in your unit" in status,
                             name_line == "Your unit is plan 1, Rebuild the cart: 4 tasks. Work all of it before you report.", detail=f"{status} / {name_line}")


def test_the_plan_card_names_the_worker_that_works_the_plan_and_no_agent_before_one_is_assigned(new_story, monkeypatch):
    worker = start_planned_worker(new_story, monkeypatch, PHASE_DISPATCH)
    previous = plan_card(worker)
    worker.story.expect_success(f"plan assign 1 --to {agent_number(worker.story, worker.worker.id)} --environment main", actor=worker.story.user)
    after = plan_card(worker)
    worker.story.expect_rows(previous["assignee"] is None, after["assignee"] is not None and after["assignee"]["id"] == worker.worker.id, detail=f"{previous} / {after}")


def plan_card(worker):
    board = json.loads(worker.story.run("plan board --environment main --json", actor=worker.story.user).output_text)
    return next(card for card in board["plans"] if card["id"] == 1)


def test_a_plan_dispatched_before_dispatch_named_its_worker_gets_its_worker_from_the_upgrade(new_story, monkeypatch):
    worker = start_planned_worker(new_story, monkeypatch)
    database = worker.story.container.get(Database)
    database.update(Statement("UPDATE assignments SET source_id = NULL WHERE source_id IN (SELECT id FROM assignments WHERE subject_model IN ('plan', 'phase'))"))
    database.update(Statement("DELETE FROM assignments WHERE subject_model IN ('plan', 'phase')"))
    previous = worker_unit(worker)
    PlanWorkerBackfillMigration().run(database)
    card = plan_card(worker)
    worker.story.expect_rows(previous.plan is None, card["assignee"] is not None and card["assignee"]["id"] == worker.worker.id, detail=str(card))


def test_the_agent_card_names_the_unit_of_a_worker_on_a_plan(new_story, monkeypatch):
    worker = start_planned_worker(new_story, monkeypatch)
    listed = json.loads(worker.story.run("usage agents --environment main --json", actor=worker.story.user).output_text)
    card = next(row for row in listed["rows"] if row["id"] == worker.worker.id)
    worker.story.expect_rows(card["unit_name"] == "Plan 1 · Rebuild the cart", detail=str(card))
