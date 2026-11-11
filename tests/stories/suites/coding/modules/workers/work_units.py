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
