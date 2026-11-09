import pytest

from core.base.actor import Actor
from core.base.actor_type import ActorType
from suites.coding.modules.workers.listeners.worker_test_listener import WorkerTestListener
from suites.coding.modules.workers.ticks.stalled_worker_tests import StalledWorkerTests
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import CART_CHANGE, repository_environment
from tests.stories.suites.coding.modules.workers.test_queue import PROOF, recording_launch

RUNNING = "the tests of task 1 are running"


@pytest.fixture
def two_tasks(new_story, monkeypatch):
    story = new_story(fixture=OpenTaskOrchestrator)
    started = recording_launch(monkeypatch)
    repository = repository_environment(story)
    story.run('task make "Tax" --brief "The tax"', actor=story.agent)
    worker = Actor(story.new_row_id("worker dispatch --test-command python=pytest --model sonnet 1 2", actor=story.agent), ActorType.AGENT)
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.expect_success(PROOF, actor=worker)
    return story, worker, started


def test_a_queued_test_a_server_update_left_behind_is_started_by_the_tick(two_tasks, monkeypatch):
    story, worker, _ = two_tasks
    with monkeypatch.context() as stopped_server:
        stopped_server.setattr(WorkerTestListener, "start_next", lambda listener, logged: None)
        story.expect_text("worker next --wait --differences none", "are queued", actor=worker)
    story.expect_text("proof show 1 --environment main", "state: queued")
    StalledWorkerTests()(story.container)
    story.expect_text("proof show 1", "state: running", actor=story.agent)


def test_a_proof_with_a_test_the_main_agent_checked_needs_no_run_and_the_worker_goes_on(two_tasks):
    story, worker, started = two_tasks
    story.expect_success("proof check 1", actor=story.agent)
    story.expect_success("worker next --wait --differences none", actor=worker)
    story.run_listeners()
    story.expect_rows(started == [])
    story.expect_text("task show 1", "state: completed", actor=story.agent)
    story.expect_text("task show 2", "state: started", actor=story.agent)


def test_worker_next_says_the_tests_run_only_while_they_do(two_tasks):
    story, worker, _ = two_tasks
    story.expect_success("worker next --wait --differences none", actor=worker)
    story.run_listeners()
    story.expect_refusal("worker next --wait --differences none", RUNNING, actor=worker)


@pytest.fixture
def edited_proof(two_tasks):
    story, worker, started = two_tasks
    story.expect_success("worker next --wait --differences none", actor=worker)
    story.run_listeners()
    story.expect_success('proof short 1 "the total is missing"', actor=story.agent)
    story.expect_success('proof edit 1 --task 1 "cart.py:1, the cart story and the total" --test "python tests/cart.py"', actor=worker)
    story.expect_text("proof show 1", "state: shown", actor=story.agent)
    return story, worker, started


def test_worker_next_queues_a_test_a_proof_edit_left_behind(edited_proof):
    story, worker, started = edited_proof
    story.expect_text("worker next --wait --differences none", "are queued", actor=worker)
    story.expect_text("proof show 1", "state: running", actor=story.agent)
    story.expect_rows(len(started) == 2)


def test_the_tick_queues_a_test_a_proof_edit_left_behind(edited_proof):
    story, _, _ = edited_proof
    StalledWorkerTests()(story.container)
    story.expect_text("proof show 1", "state: running", actor=story.agent)


def test_with_nothing_to_run_and_a_proof_left_to_check_the_worker_goes_on(new_story, monkeypatch):
    story = new_story(fixture=OpenTaskOrchestrator)
    recording_launch(monkeypatch)
    repository = repository_environment(story)
    story.run('task make "Tax" --brief "The tax"', actor=story.agent)
    worker = Actor(story.new_row_id("worker dispatch --test-command python=pytest --model sonnet 1 2", actor=story.agent), ActorType.AGENT)
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.expect_success('proof make 1 --task 1 "cart.py:1, read by hand"', actor=worker)
    story.expect_success("worker next --wait --differences none", actor=worker)
    story.expect_text("task show 1", "state: testing", actor=story.agent)
    story.expect_text("task show 2", "state: started", actor=story.agent)
