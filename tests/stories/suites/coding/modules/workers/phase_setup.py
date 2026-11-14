from core.modules.processes.support.output_folder import OutputFolder
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_steps import WorkerSteps
from tests.stories.support.story_checks import expect_value
from tests.stories.suites.coding.modules.workers.support.commit_command import COMMIT
from tests.stories.suites.coding.modules.workers.support.phase_steps import TEST_LINE, start_planned_worker, unplanned_worker
from suites.coding.modules.workers.support.worker_settings import AFFECTED_TESTS_COMMAND
from suites.coding.modules.workers.support.worker_settings import PROJECT_TEST_COMMAND


def read_steps(worker) -> WorkerSteps:
    return worker.story.container.get(WorkerSteps)


def read_worktree(worker):
    return worker.story.container.get(WorktreeQuery).worker_worktree(worker.worker.id)


def test_a_worker_dispatched_on_a_plan_holds_its_first_task_and_the_plan_is_started(new_story, monkeypatch):
    planned_worker = start_planned_worker(new_story, monkeypatch)
    planned_worker.story.expect_text("task show 1", "state: started", f"holder_id: {planned_worker.worker.id}", actor=planned_worker.story.agent)
    planned_worker.story.expect_text("plan show 1", "state: started", actor=planned_worker.story.agent)


def test_a_short_proof_is_a_failure(new_story, monkeypatch):
    planned_worker = start_planned_worker(new_story, monkeypatch)
    steps = read_steps(planned_worker)
    planned_worker.edit_prove()
    expect_value(not steps.has_open_failure(read_worktree(planned_worker)), True)
    planned_worker.story.expect_success('proof short 1 "the total is missing"', actor=planned_worker.story.agent)
    expect_value(steps.has_open_failure(read_worktree(planned_worker)), True)


def test_a_failed_selected_test_is_a_failure(new_story, monkeypatch):
    external = unplanned_worker(new_story, monkeypatch)
    steps = read_steps(external)
    external.story.expect_success(f'setting set {AFFECTED_TESTS_COMMAND} "python3 pick.py" --environment main')
    external.story.expect_success(f'setting set {PROJECT_TEST_COMMAND} "python3 -m pytest -q" --environment main')
    external.edit_prove(TEST_LINE)
    external.story.expect_success(COMMIT, actor=external.worker)
    external.end_test(external.started[0])
    external.story.container.get(OutputFolder).write_output(external.started[1], 1, "tests/other.py\n")
    external.end_test(external.started[1])
    expect_value(not steps.has_open_failure(read_worktree(external)), True)
    external.end_test(external.started[2], 1)
    expect_value(steps.has_open_failure(read_worktree(external)), True)
