import pytest
from unittest.mock import patch

from engine.testing.expectations.expect_reply import expect_reply_allowed, expect_reply_refusal
from engine.testing.examples.hook_samples import HookSamples
from suites.coding.modules.workers.listeners.worker_test_listener import WorkerTestListener
from suites.coding.modules.workers.support.worker_phases import WorkerPhases
from suites.coding.modules.workers.queries.proof_query import ProofQuery
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from core.modules.plans.support.task_plans import TaskPlans
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.ticks.stalled_worker_test_runs import StalledWorkerTestRuns
from tests.stories.server.support.server_client import server_story
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import repository_folder, story_repository
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH, GitRepository
from tests.stories.suites.coding.modules.workers.support.phase_steps import PLAN_DISPATCH, TEST_LINE, dispatched_story_worker, planned_story, start_planned_worker

MAIN_SESSION = "s-1"
PLAN_BLOCK = 'plan block 1 --reason "the supplier is late"'


@pytest.fixture
def planned_worker(new_story, monkeypatch):
    return start_planned_worker(new_story, monkeypatch)


@pytest.fixture
def advanced_with_test(planned_worker):
    planned_worker.prove_advance(TEST_LINE)
    return planned_worker


@pytest.fixture
def advanced_without_test(planned_worker):
    planned_worker.prove_advance()
    return planned_worker


@pytest.fixture
def previous_test_running(planned_worker):
    planned_worker.story.run('plan block 1 --reason "a pause"', actor=planned_worker.story.agent)
    planned_worker.prove_advance(TEST_LINE)
    planned_worker.story.run("plan unblock 1", actor=planned_worker.story.agent)
    return planned_worker


@pytest.fixture
def previous_test_ended(previous_test_running):
    previous_test_running.end_all_tests()
    return previous_test_running


@pytest.fixture
def conflict_waiting(new_story, monkeypatch):
    story = planned_story(new_story)
    base = story_repository(story)
    base.checkout(ENVIRONMENT_BRANCH)
    base.committed("tax.py", "TAX = 1\n", "The first tax")
    worker = dispatched_story_worker(story, PLAN_DISPATCH, monkeypatch)
    worker.prove()
    worker.repository.changed(worker.worker.id, "tax.py", "TAX = 5\n")
    base.committed("tax.py", "TAX = 21\n", "Another tax")
    return worker


@pytest.fixture
def last_task(planned_worker):
    planned_worker.prove_advance(TEST_LINE)
    planned_worker.prove_advance()
    planned_worker.prove()
    return planned_worker


@pytest.fixture
def plan_task_first(new_story, monkeypatch):
    story = planned_story(new_story)
    story.run('task make "Docs" --brief "The docs" --environment main', actor=story.agent)
    return dispatched_story_worker(story, "worker dispatch --test-command python=pytest --model sonnet 1 5", monkeypatch)


def displayed_task_states(worker) -> dict[int, str]:
    with server_story(worker.story) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        outline = server.viewer_line_value(cookie, {"window": "plans.plans", "line": ["plan", "outline", "1"], "environment": "main"})
    return {task["id"]: task["state"] for phase in outline["phases"] for task in phase["tasks"]}


def test_a_workers_phase_is_found_with_one_membership_lookup(planned_worker):
    story = planned_worker.story
    plans = story.container.get(TaskPlans)
    task = story.row(Task, planned_worker.current_task())
    with patch.object(plans, "find_phase", wraps=plans.find_phase) as find_phase:
        phase = story.container.get(WorkerPhases).phase(task)
    story.expect_rows(phase is not None, phase.id == 1, find_phase.call_count == 1)


def test_a_worker_status_reuses_its_phase_worktree_and_waiting_test_reads(planned_worker):
    story = planned_worker.story
    worktrees = story.container.get(WorktreeQuery)
    proofs = story.container.get(ProofQuery)
    plans = story.container.get(TaskPlans)
    task_id = planned_worker.current_task()
    with story.repeated_work.request():
        worktree = worktrees.worker_worktree(planned_worker.worker.id)
        answers = [(worktrees.worker_worktree(planned_worker.worker.id), worktrees.newest_worktree(planned_worker.worker.id),
                    proofs.tests_waiting(worktree.id), plans.find_phase(task_id)) for _ in range(12)]
    story.expect_rows(all(row[0].id == worktree.id and row[1].id == worktree.id and not row[2] and row[3].id == 1 for row in answers))


@pytest.mark.real_git
def test_a_clash_with_the_base_branch_stops_the_move(conflict_waiting):
    conflict_waiting.story.expect_refusal("worker next --wait --differences none", "clashes", actor=conflict_waiting.worker)
    conflict_waiting.story.expect_text("task show 1", "state: started", actor=conflict_waiting.story.agent)


def test_the_stalled_test_tick_does_not_start_the_proofs_of_a_task_moved_past(advanced_with_test):
    StalledWorkerTestRuns()(advanced_with_test.story.container)
    advanced_with_test.story.expect_rows(advanced_with_test.started == [])
    advanced_with_test.story.expect_text("proof show 1", "state: shown", actor=advanced_with_test.story.agent)


def test_the_stalled_test_tick_starts_a_test_left_behind_after_the_hand_in_of_a_phase(last_task, monkeypatch):
    with monkeypatch.context() as stopped_server:
        stopped_server.setattr(WorkerTestListener, "start_next", lambda listener, logged: None)
        last_task.story.expect_text("worker next --wait --differences none", "queued", actor=last_task.worker)
    last_task.story.expect_text("proof show 1", "state: queued", actor=last_task.story.agent)
    StalledWorkerTestRuns()(last_task.story.container)
    last_task.story.expect_text("proof show 1", "state: running", actor=last_task.story.agent)


def test_a_test_run_after_a_running_test_uses_the_phase_allowance(previous_test_ended):
    expect_reply_allowed(previous_test_ended.run_test())


def test_on_a_blocked_plan_a_worker_runs_tests_as_today(advanced_with_test):
    advanced_with_test.story.expect_success(PLAN_BLOCK, actor=advanced_with_test.story.agent)
    expect_reply_allowed(advanced_with_test.run_test())


def test_on_a_blocked_plan_the_earlier_proofs_run_at_the_next_hand_in(advanced_with_test):
    advanced_with_test.story.expect_success(PLAN_BLOCK, actor=advanced_with_test.story.agent)
    advanced_with_test.prove_advance()
    advanced_with_test.story.expect_text("proof show 1", "state: running", actor=advanced_with_test.story.agent)
    advanced_with_test.story.expect_rows(len(advanced_with_test.started) == 1)


def test_a_cancelled_plan_cancels_the_workers_tasks_and_the_worker_may_stop(advanced_with_test):
    advanced_with_test.story.expect_success('plan cancel 1 --reason "the cart is dropped"', actor=advanced_with_test.story.agent)
    advanced_with_test.story.expect_text("task show 2", "state: cancelled", actor=advanced_with_test.story.agent)
    advanced_with_test.story.expect_hook_allowed(advanced_with_test.session, HookSamples.stop())


def test_a_task_of_a_plan_and_then_a_task_outside_it_each_follow_their_own_flow(plan_task_first):
    expect_reply_allowed(plan_task_first.run_test())
    plan_task_first.edit_prove(TEST_LINE)
    plan_task_first.story.expect_text("worker next --wait --differences none", "queued", actor=plan_task_first.worker)
    plan_task_first.end_all_tests()
    plan_task_first.story.expect_rows(plan_task_first.current_task() == 5)
    expect_reply_allowed(plan_task_first.run_test())


def test_a_proof_with_no_test_on_a_phase_does_not_refuse_the_main_agents_stop(advanced_without_test):
    advanced_without_test.story.expect_hook_allowed(MAIN_SESSION, HookSamples.stop())


def test_a_person_sees_the_tasks_of_a_phase_as_completed_once_its_tests_have_passed(last_task):
    last_task.story.run("worker next --wait --differences none", actor=last_task.worker)
    last_task.end_all_tests()
    states = displayed_task_states(last_task)
    last_task.story.expect_rows((states[1], states[2], states[3], states[4]) == ("completed", "completed", "completed", "started"))
