from datetime import datetime, timedelta, timezone

import pytest

from core.base.caller.process_row import ProcessRow
from core.base.journal_home import LAUNCHER_SOCKET
from core.base.leftover_process import LeftoverProcess
from core.base.timestamp import Timestamp
from core.testing.fake_launcher import FakeLauncher
from core.testing.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import BuilderWithUser, OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment, worker_session

MAIN_SESSION = "s-1"
WORKER_PID = 700
RUNNING_PROGRAM = ProcessRow(WORKER_PID, 1, Timestamp(datetime(2026, 10, 31, 9, 0, tzinfo=timezone.utc)))


def launcher_answering(story, answer: bytes, request_count: int = 1) -> FakeLauncher:
    path = story.home.socket(LAUNCHER_SOCKET)
    path.unlink(missing_ok=True)
    return FakeLauncher(path, answer=answer, request_count=request_count)


def expect_started_again(story, launcher: FakeLauncher) -> None:
    launcher.thread.join(10)
    assert launcher.requests, "the launcher was handed nothing"
    story.expect_text(f"agent-line list --agent {story.worker.id}", "Add the tax")


@pytest.fixture(autouse=True)
def no_program_on_the_machine(monkeypatch):
    monkeypatch.setattr(LeftoverProcess, "command_line", staticmethod(lambda pid: ""))


@pytest.fixture
def worker_story(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository_environment(story)
    return story


@pytest.fixture
def launched(worker_story):
    """A worker the launcher started and answered the pid of, whose program runs."""
    story = worker_story
    story.use_processes(RUNNING_PROGRAM)
    launcher_answering(story, f"started {WORKER_PID}\n".encode())
    story.worker = dispatched_worker(story)
    story.run_listeners()
    story.advance(timedelta(minutes=5))
    return story


@pytest.fixture
def ended_unseen(launched):
    """The same worker after its program ended with no end hook and a tick noticed."""
    launched.use_processes()
    launched.tick(MAIN_SESSION)
    launched.run_listeners()
    return launched


def test_the_launcher_answering_a_pid_records_the_workers_process(launched):
    launched.expect_text(f"agent show {launched.worker.id}", f"pid: {WORKER_PID}", "process_started_at: 2026-10-31T09:00:00")


def test_a_worker_whose_end_hook_was_lost_is_ended_at_a_tick(ended_unseen):
    ended_unseen.expect_text(f"agent show {ended_unseen.worker.id}", "ended_at: 2026")


def test_a_running_worker_is_not_ended_at_a_tick(launched):
    launched.tick(MAIN_SESSION)
    launched.expect_no_text(f"agent show {launched.worker.id}", "ended_at:")


def test_a_send_after_a_tick_ended_the_worker_restarts_it(ended_unseen):
    launcher = launcher_answering(ended_unseen, f"started {WORKER_PID}\n".encode())
    ended_unseen.expect_text(f'worker send {ended_unseen.worker.id} "Add the tax"', "was not running: the job starts it again", actor=ended_unseen.agent)
    ended_unseen.run_listeners()
    expect_started_again(ended_unseen, launcher)


def test_a_send_finds_a_process_gone_before_the_tick_does_and_restarts_the_worker(launched):
    launched.use_processes()
    launcher = launcher_answering(launched, b"started\n")
    launched.expect_text(f'worker send {launched.worker.id} "Add the tax"', "was not running: the job starts it again", actor=launched.agent)
    launched.expect_text(f"agent show {launched.worker.id}", "ended_at: 2026")
    launched.run_listeners()
    expect_started_again(launched, launcher)


def test_a_send_to_a_running_worker_says_it_takes_the_job(launched):
    launched.expect_success(f'worker send {launched.worker.id} "Add the tax"', f"worker {launched.worker.id} takes the job", actor=launched.agent)


def test_a_send_to_a_worker_with_no_recorded_process_says_the_journal_cannot_tell(worker_story):
    worker = dispatched_worker(worker_story)
    worker_story.expect_text(f'worker send {worker.id} "Add the tax"', "its process is not recorded, so the journal cannot say whether it runs", f"journal worker status {worker.id}", actor=worker_story.agent)


def test_a_send_with_no_launcher_says_the_worker_is_not_running(ended_unseen):
    ended_unseen.home.socket(LAUNCHER_SOCKET).unlink(missing_ok=True)
    ended_unseen.expect_text(f'worker send {ended_unseen.worker.id} "Add the tax"', "is not running and has the job waiting", "needs the launcher", actor=ended_unseen.agent)


def test_a_restarted_worker_keeps_its_new_process_through_its_first_hook(ended_unseen):
    worker = ended_unseen.worker
    fresh = ProcessRow(WORKER_PID + 1, 1, RUNNING_PROGRAM.started_at)
    ended_unseen.use_processes(fresh)
    launcher = launcher_answering(ended_unseen, f"started {fresh.pid}\n".encode())
    ended_unseen.expect_text(f'worker send {worker.id} "Add the tax"', "the job starts it again", actor=ended_unseen.agent)
    ended_unseen.run_listeners()
    launcher.thread.join(10)
    ended_unseen.hook(worker_session(ended_unseen, worker), HookSamples.session_start())
    ended_unseen.expect_text(f"agent show {worker.id}", f"pid: {fresh.pid}")
    ended_unseen.expect_no_text(f"agent show {worker.id}", "ended_at:")
    ended_unseen.tick(MAIN_SESSION)
    ended_unseen.expect_no_text(f"agent show {worker.id}", "ended_at:")


def test_a_launcher_that_answers_no_pid_leaves_no_old_process_on_the_worker(launched):
    worker = launched.worker
    launched.expect_success(f"agent end {worker.id}", actor=launched.agent)
    launcher = launcher_answering(launched, b"started\n")
    launched.expect_text(f'worker send {worker.id} "Add the tax"', "the job starts it again", actor=launched.agent)
    launched.run_listeners()
    launcher.thread.join(10)
    launched.expect_no_text(f"agent show {worker.id}", "pid:")


def test_a_send_to_a_paused_worker_says_it_waits_for_the_resume(launched):
    worker = launched.worker
    launched.expect_success(f"agent pause {worker.id}", actor=launched.agent)
    launched.use_processes()
    launched.expect_text(f'worker send {worker.id} "Add the tax"', "is paused: the job waits until it is resumed", actor=launched.agent)


def test_a_helper_whose_end_hook_was_lost_is_ended_at_a_tick(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.use_processes(RUNNING_PROGRAM)
    launcher = launcher_answering(story, f"started {WORKER_PID}\n".encode())
    helper = story.new_row_id('helper start journal-researcher --brief "Read src/cart.py" --environment main', actor=story.agent)
    story.run_listeners()
    launcher.thread.join(10)
    story.expect_text(f"agent show {helper}", f"pid: {WORKER_PID}")
    story.use_processes()
    story.tick(MAIN_SESSION)
    story.expect_text(f"agent show {helper}", "ended_at: 2026")
