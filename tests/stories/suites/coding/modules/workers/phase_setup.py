from core.modules.processes.support.output_folder import OutputFolder
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_phases import WorkerPhases
from tests.stories.support.story_checks import expect_value
from tests.stories.suites.coding.modules.workers.support.phase_steps import TEST_LINE, worker_on_plan, worker_outside_plan


def phases_of(worker) -> WorkerPhases:
    return worker.story.container.get(WorkerPhases)


def worktree_of(worker):
    return worker.story.container.get(WorktreeQuery).worker_worktree(worker.worker.id)


def test_a_worker_dispatched_on_a_plan_holds_its_first_task_and_the_plan_is_started(new_story, monkeypatch):
    on_plan = worker_on_plan(new_story, monkeypatch)
    on_plan.story.expect_text("task show 1", "state: started", f"holder_id: {on_plan.worker.id}", actor=on_plan.story.agent)
    on_plan.story.expect_text("plan show 1", "state: started", actor=on_plan.story.agent)


def test_the_phase_of_a_task_and_whether_the_next_task_is_in_it(new_story, monkeypatch):
    on_plan = worker_on_plan(new_story, monkeypatch)
    outside = on_plan.story.row(Task, on_plan.story.new_row_id('task make "Docs" --brief "The docs" --environment main', actor=on_plan.story.agent))
    first, second, next_phase = (on_plan.story.row(Task, task_id) for task_id in (1, 2, 4))
    phases = phases_of(on_plan)
    expect_value((phases.phase(first).title, phases.phase(next_phase).title, phases.phase(outside)) == ("Build", "Ship", None), True)
    expect_value(phases.continues(first, second), True)
    expect_value(not any((phases.continues(first, next_phase), phases.continues(first, outside), phases.continues(first, None), phases.continues(outside, first))), True)


def test_a_blocked_plan_has_no_phase_and_holds_nothing_back(new_story, monkeypatch):
    on_plan = worker_on_plan(new_story, monkeypatch)
    phases = phases_of(on_plan)
    on_plan.story.expect_rows(phases.has_phase_wait(on_plan.worker.id))
    on_plan.story.expect_success('plan block 1 --reason "the supplier is late"', actor=on_plan.story.agent)
    first, second = on_plan.story.row(Task, 1), on_plan.story.row(Task, 2)
    expect_value(phases.phase(first) is None, True)
    expect_value(not phases.continues(first, second), True)
    on_plan.story.expect_rows(not phases.has_phase_wait(on_plan.worker.id))


def test_a_short_proof_is_a_failure_and_holds_nothing_back(new_story, monkeypatch):
    on_plan = worker_on_plan(new_story, monkeypatch)
    phases = phases_of(on_plan)
    on_plan.change_and_prove()
    expect_value(not phases.has_open_failure(worktree_of(on_plan)), True)
    on_plan.story.expect_success('proof short 1 "the total is missing"', actor=on_plan.story.agent)
    expect_value(phases.has_open_failure(worktree_of(on_plan)), True)
    on_plan.story.expect_rows(not phases.has_phase_wait(on_plan.worker.id))


def test_a_failed_selected_test_is_a_failure_and_a_task_outside_a_plan_holds_nothing_back(new_story, monkeypatch):
    outside = worker_outside_plan(new_story, monkeypatch)
    phases = phases_of(outside)
    outside.story.expect_rows(not phases.has_phase_wait(outside.worker.id))
    outside.story.expect_rows(not phases.has_phase_wait(outside.story.agent.id))
    outside.story.expect_success('setting set journal.suites.coding.workers.affected-tests-command "python3 pick.py" --environment main')
    outside.story.expect_success('setting set journal.suites.coding.workers.project-test-command "python3 -m pytest -q" --environment main')
    outside.change_and_prove(TEST_LINE)
    outside.story.expect_success("worker next --wait --differences none", actor=outside.worker)
    outside.end_test(outside.started[0])
    outside.story.container.get(OutputFolder).write_output(outside.started[1], 1, "tests/other.py\n")
    outside.end_test(outside.started[1])
    expect_value(not phases.has_open_failure(worktree_of(outside)), True)
    outside.end_test(outside.started[2], 1)
    expect_value(phases.has_open_failure(worktree_of(outside)), True)
