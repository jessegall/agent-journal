import pytest

from engine.actor.actor import Actor
from core.base.command.context import Context
from core.base.database.database import Database
from engine.query.queries import Queries
from core.modules.messages.commands.read_message.read_message import ReadMessage
from core.modules.plans.models.phase import Phase
from suites.coding.modules.workers.support.worker_test_group import WorkerTestGroup
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.models.affected_test import AffectedTest
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_proof_queue import WorkerProofQueue
from tests.stories.support.story_checks import expect_value
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import CART_CHANGE
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH
from tests.stories.suites.coding.modules.workers.support.phase_steps import SECOND_TEST_LINE, PHASE_DISPATCH, TEST_LINE, dispatched_story_worker, planned_story, start_planned_worker

PHASE_TEST = "pytest tests/phase.py"
CHANGED_PHASE_TEST = "pytest tests/phase_part.py"


def last_phase_task(worker, first_test: str = "", last_test: str = ""):
    worker.prove_advance(first_test)
    worker.prove_advance()
    worker.prove(last_test)
    return worker


def expect_task_states(worker, state: str, *task_ids: int) -> None:
    for task_id in task_ids:
        worker.story.expect_text(f"task show {task_id}", f"state: {state}", actor=worker.story.agent)


@pytest.fixture
def declared_tests(new_story, monkeypatch):
    return last_phase_task(start_planned_worker(new_story, monkeypatch), TEST_LINE, SECOND_TEST_LINE)


@pytest.fixture
def undeclared_tests(new_story, monkeypatch):
    return last_phase_task(start_planned_worker(new_story, monkeypatch))


@pytest.fixture
def single_phase_tests(new_story, monkeypatch):
    worker = start_planned_worker(new_story, monkeypatch, PHASE_DISPATCH)
    worker.story.expect_success("setting set journal.suites.coding.workers.merger-on off --environment main", actor=worker.story.user)
    return last_phase_task(worker, TEST_LINE, SECOND_TEST_LINE)


@pytest.fixture
def delivered_phase(single_phase_tests):
    single_phase_tests.story.run("worker deliver --wait --differences none", actor=single_phase_tests.worker)
    single_phase_tests.end_all_tests()
    return single_phase_tests


@pytest.fixture
def two_workers(new_story, monkeypatch):
    story = planned_story(new_story)
    first = dispatched_story_worker(story, "worker dispatch --test-command python=pytest --model sonnet 1", monkeypatch)
    return first, first.added_worker("worker dispatch --test-command python=pytest --model sonnet 2 3")


def test_queue_phase_checks_the_proofs_with_no_test_adds_the_phases_own_test_once_and_queues_the_rest(new_story, monkeypatch):
    worker = start_planned_worker(new_story, monkeypatch, build_test=PHASE_TEST)
    story = worker.story
    story.expect_success('setting set journal.suites.coding.workers.affected-tests-command "python3 pick.py" --project')
    story.expect_success('setting set journal.suites.coding.workers.project-test-command "python3 run_tests.py" --project')
    worker.prove_advance(TEST_LINE)
    worker.edit_prove()
    queue = story.container.get(WorkerProofQueue)
    worktree = story.container.get(WorktreeQuery).worker_worktree(worker.worker.id)
    context = Context(Actor.core(), story.clock.timestamp(), ReadMessage(1))
    for expected_count in (3, 1):
        with story.container.get(Database).transaction():
            story.expect_rows(queue.queue_group(worktree, story.row(Task, 2), WorkerTestGroup(story.row(Phase, 1), ()), context) == expected_count)
    story.expect_text("proof show 1", "state: queued", actor=story.agent)
    story.expect_text("proof show 2", "state: checked", actor=story.agent)
    story.expect_text("proof show 3", "point: 0", "state: queued", f"test_command: {PHASE_TEST}", "Build", actor=story.agent)
    story.expect_refusal("proof show 4", "no proof 4", actor=story.agent)
    story.expect_rows(story.container.get(Queries).query(AffectedTest).filter(worktree_id=worktree.id).exists())
    story.expect_success(f"worker-worktree points --agent {worker.worker.id}", actor=story.agent)


def test_a_worker_cannot_make_a_proof_at_the_point_of_a_phases_own_test(new_story, monkeypatch):
    worker = start_planned_worker(new_story, monkeypatch)
    worker.story.expect_refusal('proof make 0 --task 1 "cart.py:1, the phase"', "start at 1", actor=worker.worker)


def test_the_phases_own_test_runs_at_its_end_as_a_proof_of_the_last_task(new_story, monkeypatch):
    worker = last_phase_task(start_planned_worker(new_story, monkeypatch, build_test=PHASE_TEST))
    worker.story.expect_text("worker next --wait --differences none", "queued", actor=worker.worker)
    worker.story.expect_text("proof list --task 3", PHASE_TEST, actor=worker.story.agent)
    expect_value([process.line for process in worker.started_processes()] == [PHASE_TEST], True)


def test_a_changed_phase_test_replaces_the_command_of_its_proof_at_the_next_hand_in(new_story, monkeypatch):
    worker = last_phase_task(start_planned_worker(new_story, monkeypatch, build_test=PHASE_TEST))
    story = worker.story
    story.expect_text("worker next --wait --differences none", "queued", actor=worker.worker)
    story.expect_success(f'phase edit 1 --test-command "{CHANGED_PHASE_TEST}"', actor=story.user)
    story.expect_success('proof short 4 "the test failed"', actor=story.agent)
    worktree = story.container.get(WorktreeQuery).worker_worktree(worker.worker.id)
    context = Context(Actor.core(), story.clock.timestamp(), ReadMessage(1))
    with story.container.get(Database).transaction():
        story.container.get(WorkerProofQueue).queue_group(worktree, story.row(Task, 3), WorkerTestGroup(story.row(Phase, 1), ()), context)
    story.expect_text("proof list --task 3", CHANGED_PHASE_TEST, actor=story.agent)


def test_the_selected_tests_run_at_the_end_of_a_phase_after_the_proofs(declared_tests):
    declared_tests.story.expect_success('setting set journal.suites.coding.workers.affected-tests-command "python3 pick.py" --environment main')
    declared_tests.story.expect_success('setting set journal.suites.coding.workers.project-test-command "python3 run_tests.py" --environment main')
    declared_tests.story.expect_text("worker next --wait --differences none", "queued", actor=declared_tests.worker)
    declared_tests.end_test(declared_tests.started[0])
    declared_tests.end_test(declared_tests.started[1])
    declared_tests.story.expect_rows("pick.py" in declared_tests.started_processes()[2].line)


def test_with_no_test_at_all_the_tasks_close_at_once_and_the_next_task_starts(undeclared_tests):
    undeclared_tests.story.expect_success("worker next --wait --differences none", actor=undeclared_tests.worker)
    expect_task_states(undeclared_tests, "completed", 1, 2, 3)
    undeclared_tests.story.expect_rows(undeclared_tests.started == [])
    undeclared_tests.story.expect_rows(undeclared_tests.current_task() == 4)


def test_a_delivered_phase_that_passes_gives_the_main_agent_one_line_and_the_merge_needs_no_check(delivered_phase):
    lines = delivered_phase.main_agent_lines()
    delivered_phase.story.expect_rows(len(lines) == 1 and f"the tests of worker:{delivered_phase.worker.id} all pass" in lines[0])
    delivered_phase.repository.checkout(ENVIRONMENT_BRANCH)
    delivered_phase.story.expect_success(f"worker logs {delivered_phase.worker.id}", actor=delivered_phase.story.agent)
    delivered_phase.story.expect_success(f"worker merge --wait {delivered_phase.worker.id}", actor=delivered_phase.story.agent)
    delivered_phase.repository.expect_file(ENVIRONMENT_BRANCH, "cart.py", CART_CHANGE)


def test_two_workers_in_one_phase_each_reach_its_end_at_their_own_last_task(two_workers):
    first, second = two_workers
    first.edit_prove(TEST_LINE)
    first.story.expect_text("worker deliver --wait --differences none", "queued", actor=first.worker)
    first.story.expect_rows(len(first.started) == 1)
    second.edit_prove(SECOND_TEST_LINE)
    second.story.expect_success("worker next --wait --differences none", actor=second.worker)
    first.story.expect_rows(second.current_task() == 3)
    first.story.expect_rows(len(first.started) == 1)
    first.end_test(first.started[0])
    expect_task_states(first, "completed", 1)
    expect_task_states(first, "testing", 2)
    expect_task_states(first, "started", 3)


def test_two_workers_each_run_the_phases_own_test_in_their_own_worktree(new_story, monkeypatch):
    story = planned_story(new_story, build_test=PHASE_TEST)
    first = dispatched_story_worker(story, "worker dispatch --test-command python=pytest --model sonnet 1", monkeypatch)
    second = first.added_worker("worker dispatch --test-command python=pytest --model sonnet 2")
    first.prove()
    first.story.expect_success("worker deliver --wait --differences none", actor=first.worker)
    second.prove()
    second.story.expect_success("worker deliver --wait --differences none", actor=second.worker)
    first.end_all_tests()
    folders = {process.folder for process in first.started_processes() if process.line == PHASE_TEST}
    story.expect_rows(folders == {str(first.repository.worktree_folder(first.worker.id)), str(second.repository.worktree_folder(second.worker.id))})
