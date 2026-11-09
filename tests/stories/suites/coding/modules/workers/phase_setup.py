from core.modules.processes.support.output_folder import OutputFolder
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_phases import WorkerPhases
from tests.stories.support.story_checks import expect_value
from tests.stories.suites.coding.modules.workers.support.phase_steps import TEST_LINE, start_planned_worker, unplanned_worker


def read_phases(worker) -> WorkerPhases:
    return worker.story.container.get(WorkerPhases)


def read_worktree(worker):
    return worker.story.container.get(WorktreeQuery).worker_worktree(worker.worker.id)


def test_a_worker_dispatched_on_a_plan_holds_its_first_task_and_the_plan_is_started(new_story, monkeypatch):
    planned_worker = start_planned_worker(new_story, monkeypatch)
    planned_worker.story.expect_text("task show 1", "state: started", f"holder_id: {planned_worker.worker.id}", actor=planned_worker.story.agent)
    planned_worker.story.expect_text("plan show 1", "state: started", actor=planned_worker.story.agent)


def test_the_phase_of_a_task_and_whether_the_next_task_is_in_it(new_story, monkeypatch):
    planned_worker = start_planned_worker(new_story, monkeypatch)
    external = planned_worker.story.row(Task, planned_worker.story.new_row_id('task make "Docs" --brief "The docs" --environment main', actor=planned_worker.story.agent))
    first, second, next_phase = (planned_worker.story.row(Task, task_id) for task_id in (1, 2, 4))
    phases = read_phases(planned_worker)
    expect_value((phases.phase(first).title, phases.phase(next_phase).title, phases.phase(external)) == ("Build", "Ship", None), True)
    expect_value(phases.continues(first, second), True)
    expect_value(not any((phases.continues(first, next_phase), phases.continues(first, external), phases.continues(first, None), phases.continues(external, first))), True)


def test_a_blocked_plan_has_no_phase_and_holds_nothing_back(new_story, monkeypatch):
    planned_worker = start_planned_worker(new_story, monkeypatch)
    phases = read_phases(planned_worker)
    planned_worker.story.expect_rows(phases.has_phase_wait(planned_worker.worker.id))
    planned_worker.story.expect_success('plan block 1 --reason "the supplier is late"', actor=planned_worker.story.agent)
    first, second = planned_worker.story.row(Task, 1), planned_worker.story.row(Task, 2)
    expect_value(phases.phase(first) is None, True)
    expect_value(not phases.continues(first, second), True)
    planned_worker.story.expect_rows(not phases.has_phase_wait(planned_worker.worker.id))


def test_a_short_proof_is_a_failure_and_holds_nothing_back(new_story, monkeypatch):
    planned_worker = start_planned_worker(new_story, monkeypatch)
    phases = read_phases(planned_worker)
    planned_worker.edit_prove()
    expect_value(not phases.has_open_failure(read_worktree(planned_worker)), True)
    planned_worker.story.expect_success('proof short 1 "the total is missing"', actor=planned_worker.story.agent)
    expect_value(phases.has_open_failure(read_worktree(planned_worker)), True)
    planned_worker.story.expect_rows(not phases.has_phase_wait(planned_worker.worker.id))


def test_a_failed_selected_test_is_a_failure_and_a_task_outside_a_plan_holds_nothing_back(new_story, monkeypatch):
    external = unplanned_worker(new_story, monkeypatch)
    phases = read_phases(external)
    external.story.expect_rows(not phases.has_phase_wait(external.worker.id))
    external.story.expect_rows(not phases.has_phase_wait(external.story.agent.id))
    external.story.expect_success('setting set journal.suites.coding.workers.affected-tests-command "python3 pick.py" --environment main')
    external.story.expect_success('setting set journal.suites.coding.workers.project-test-command "python3 -m pytest -q" --environment main')
    external.edit_prove(TEST_LINE)
    external.story.expect_success("worker next --wait --differences none", actor=external.worker)
    external.end_test(external.started[0])
    external.story.container.get(OutputFolder).write_output(external.started[1], 1, "tests/other.py\n")
    external.end_test(external.started[1])
    expect_value(not phases.has_open_failure(read_worktree(external)), True)
    external.end_test(external.started[2], 1)
    expect_value(phases.has_open_failure(read_worktree(external)), True)
