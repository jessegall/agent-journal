from datetime import timedelta

import pytest

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from suites.coding.modules.workers.support.worker_test_starts import WorkerTestStarts
from suites.coding.modules.workers.models.merger_line import MergerLine
from suites.coding.modules.workers.ticks.stalled_worker_test_runs import StalledWorkerTestRuns
from suites.coding.modules.workers.ticks.unlaunched_worker_test_runs import UnlaunchedWorkerTestRuns
from suites.coding.modules.workers.workers_module import WorkersModule
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.commit_command import COMMIT
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
        stopped_server.setattr(WorkerTestStarts, "start_next", lambda starts, logged: None)
        story.expect_text(COMMIT, "its tests are queued", actor=worker)
    story.expect_text("proof show 1 --environment main", "state: queued")
    StalledWorkerTestRuns()(story.container)
    story.expect_text("proof show 1", "state: running", actor=story.agent)


def test_a_proof_run_past_the_limit_is_ended_marked_stuck_and_the_worker_and_the_main_agent_are_told(two_tasks):
    story, worker, _ = two_tasks
    story.expect_success(COMMIT, actor=worker)
    story.run_listeners()
    story.expect_text("proof show 1", "state: running", actor=story.agent)
    story.advance(timedelta(minutes=31))
    StalledWorkerTestRuns()(story.container)
    story.expect_text("proof show 1", "state: short", "stuck: the run went past 30 minutes", actor=story.agent)
    story.expect_text(f"agent-line list --agent {worker.id}", "Your tests failed")
    story.expect_rows(any("went past 30 minutes and was ended as stuck" in line.text for line in story.story_rows(MergerLine)), detail=str([line.text for line in story.story_rows(MergerLine)]))


def test_a_proof_with_a_test_the_main_agent_checked_needs_no_run_and_the_worker_goes_on(two_tasks):
    story, worker, started = two_tasks
    story.expect_success("proof check 1", actor=story.agent)
    story.expect_success("task start 2", actor=worker)
    story.expect_success(COMMIT, actor=worker)
    story.run_listeners()
    story.expect_rows(started == [])
    story.expect_text("task show 1", "state: completed", actor=story.agent)
    story.expect_text("task show 2", "state: started", actor=story.agent)


@pytest.fixture
def edited_proof(two_tasks):
    story, worker, started = two_tasks
    story.expect_success(COMMIT, actor=worker)
    story.run_listeners()
    story.expect_success('proof short 1 "the total is missing"', actor=story.agent)
    story.expect_success('proof edit 1 --task 1 "cart.py:1, the cart story and the total" --test "python tests/cart.py"', actor=worker)
    story.expect_text("proof show 1", "state: shown", actor=story.agent)
    return story, worker, started


def test_the_tick_starts_no_test_of_a_proof_shown_again_after_it_was_sent_back_and_the_next_commit_does(edited_proof):
    story, worker, _ = edited_proof
    StalledWorkerTestRuns()(story.container)
    story.expect_text("proof show 1", "state: shown", actor=story.agent)
    story.expect_success(COMMIT, actor=worker)
    story.run_listeners()
    story.expect_text("proof show 1", "state: running", actor=story.agent)


def test_with_nothing_to_run_and_a_proof_left_to_check_the_worker_goes_on(new_story, monkeypatch):
    story = new_story(fixture=OpenTaskOrchestrator)
    recording_launch(monkeypatch)
    repository = repository_environment(story)
    story.run('task make "Tax" --brief "The tax"', actor=story.agent)
    worker = Actor(story.new_row_id("worker dispatch --test-command python=pytest --model sonnet 1 2", actor=story.agent), ActorType.AGENT)
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.expect_success('proof make 1 --task 1 "cart.py:1, read by hand"', actor=worker)
    story.expect_success("task start 2", actor=worker)
    story.expect_success(COMMIT, actor=worker)
    story.expect_text("task show 1", "state: testing", actor=story.agent)
    story.expect_text("task show 2", "state: started", actor=story.agent)


def minute_tick_names():
    return {type(tick.handler).__name__ for tick in WorkersModule.tick_handlers}


def test_385_386_the_two_ticks_of_waiting_test_runs_are_named_for_test_runs(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    story.expect_rows({StalledWorkerTestRuns.__name__, UnlaunchedWorkerTestRuns.__name__} <= minute_tick_names())
    story.expect_rows(not {"StalledWorkerTests", "UnlaunchedWorkerTests"} & minute_tick_names())
