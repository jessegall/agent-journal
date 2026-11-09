import json
from datetime import datetime, timedelta, timezone

import pytest

from core.base.caller.process_row import ProcessRow
from core.base.journal_home import LAUNCHER_SOCKET
from core.base.leftover_process import LeftoverProcess
from core.base.timestamp import Timestamp
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_launch_guard import AgentLaunchGuard
from core.testing.fake_launcher import FakeLauncher
from suites.coding.modules.workers.ticks.worker_resume_retry import WorkerResumeRetry
from core.testing.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import UserBuilder, OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment, worker_session

MAIN_SESSION = "s-1"
WORKER_PID = 700
RESUMED_PID = 701
RUNNING_PROGRAM = ProcessRow(WORKER_PID, 1, Timestamp(datetime(2026, 10, 31, 9, 0, tzinfo=timezone.utc)))


def start_launcher(story, answer: bytes, request_count: int = 1) -> FakeLauncher:
    path = story.home.socket(LAUNCHER_SOCKET)
    path.unlink(missing_ok=True)
    return FakeLauncher(path, answer=answer, request_count=request_count).serve()


def expect_restart(story, launcher: FakeLauncher) -> None:
    launcher.drain_requests()
    story.expect_rows(bool(launcher.requests))
    story.expect_text(f"agent-line list --agent {story.worker.id}", "Add the tax")


@pytest.fixture(autouse=True)
def missing_program(monkeypatch):
    monkeypatch.setattr(LeftoverProcess, "command_line", staticmethod(lambda pid: ""))


@pytest.fixture
def worker_story(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    story.expect_success("setting set journal.suites.coding.workers.merger-on false --project", actor=story.user)
    repository_environment(story)
    return story


@pytest.fixture
def running_worker(worker_story):
    """A worker the launcher started and answered the pid of, whose program runs."""
    story = worker_story
    story.use_processes(RUNNING_PROGRAM)
    launcher = start_launcher(story, f"started {WORKER_PID}\n".encode())
    story.worker = dispatched_worker(story)
    story.run_listeners()
    launcher.drain_requests()
    story.expect_rows(bool(launcher.requests), story.row(Agent, story.worker.id).pid == WORKER_PID)
    story.advance(timedelta(minutes=5))
    return story


@pytest.fixture
def ended_worker(running_worker):
    """The same worker after a tick noticed its program ended, with the listeners of that end still to run."""
    running_worker.use_processes()
    running_worker.tick(MAIN_SESSION)
    return running_worker


def test_a_worker_resumed_before_the_stop_of_its_end_keeps_its_new_program(running_worker):
    story = running_worker
    story.expect_success(f'worker send --wait {story.worker.id} "Add the tax"', f"worker {story.worker.id} takes the job", actor=story.agent)
    story.use_processes()
    story.tick(MAIN_SESSION)
    launcher = start_launcher(story, f"started {RESUMED_PID}\n".encode(), request_count=2)
    WorkerResumeRetry()(story.container)
    story.expect_rows(len(launcher.requests) == 1, "command" in launcher.requests[0])
    story.run_listeners()
    story.expect_rows(not any("stop" in request for request in launcher.requests))
    story.expect_text(f"agent show {story.worker.id}", f"pid: {RESUMED_PID}")


def test_a_launch_that_holds_the_session_keeps_the_stop_of_the_end_away(ended_worker):
    story = ended_worker
    launcher = start_launcher(story, b"stopped\n", request_count=2)
    with story.container.get(AgentLaunchGuard).lock(story.row(Agent, story.worker.id).session):
        story.run_listeners()
    story.expect_rows(launcher.requests == [])


def test_a_resume_the_launcher_refuses_leaves_the_stop_of_the_end_to_land(ended_worker):
    story = ended_worker
    path = story.home.socket(LAUNCHER_SOCKET)
    path.unlink(missing_ok=True)
    launcher = FakeLauncher(path, request_count=3, answers=(b"running\n", b"running\n", b"stopped\n")).serve()
    story.run_listeners()
    stop = {"agent_id": story.worker.id, "stop": True}
    story.expect_rows("command" in launcher.requests[0], launcher.requests[-1] == stop, launcher.requests.count(stop) == 1, detail=str(launcher.requests))


def replaced_launcher(story, *answers: bytes) -> FakeLauncher:
    path = story.home.socket(LAUNCHER_SOCKET)
    path.unlink(missing_ok=True)
    return FakeLauncher(path, request_count=len(answers), answers=answers).serve()


@pytest.fixture
def worker_with_waiting_job(running_worker):
    """A worker another agent ended and then sent a job, whose program the launcher still answers for."""
    story = running_worker
    start_launcher(story, b"running\n", request_count=10)
    story.expect_success(f"agent end {story.worker.id}", actor=story.agent)
    story.advance(timedelta(seconds=1))
    story.run(f'worker send --wait {story.worker.id} "Add the tax"', actor=story.agent)
    story.run_listeners()
    return story


def test_a_resume_answered_as_running_stops_the_program_and_starts_again(worker_with_waiting_job):
    story = worker_with_waiting_job
    launcher = replaced_launcher(story, b"running\n", b"stopped\n", f"started {RESUMED_PID}\n".encode())
    WorkerResumeRetry()(story.container)
    story.expect_rows("command" in launcher.requests[0], launcher.requests[1] == {"agent_id": story.worker.id, "stop": True}, "command" in launcher.requests[2])
    story.expect_text(f"agent show {story.worker.id}", f"pid: {RESUMED_PID}")
    story.expect_text(f"agent-line list --agent {story.worker.id}", "entered")
    story.expect_no_text(f"agent-line list --agent {story.agent.id}", "could not resume")


def test_a_program_the_launcher_still_holds_is_told_to_the_main_agent_once_with_its_pid(worker_with_waiting_job):
    story = worker_with_waiting_job
    replaced_launcher(story, *(b"running\n" for _ in range(6)))
    WorkerResumeRetry()(story.container)
    WorkerResumeRetry()(story.container)
    notices = story.run("merger-line list").output_text
    story.expect_rows(notices.count(f"agent:{story.worker.id} could not resume: the launcher still holds its program, process {WORKER_PID}") == 1)
    story.expect_no_text(f"agent-line list --agent {story.agent.id}", "the launcher still holds its program")


def test_a_resume_a_launch_in_hand_holds_stops_nothing(worker_with_waiting_job):
    story = worker_with_waiting_job
    launcher = replaced_launcher(story, b"stopped\n")
    with story.container.get(AgentLaunchGuard).lock(story.row(Agent, story.worker.id).session):
        WorkerResumeRetry()(story.container)
    story.expect_rows(launcher.requests == [])


def test_a_send_to_an_ended_worker_does_not_say_it_starts(ended_worker):
    start_launcher(ended_worker, b"running\n", request_count=4)
    outcome = ended_worker.run(f'worker send --wait {ended_worker.worker.id} "Add the tax"', actor=ended_worker.agent)
    ended_worker.expect_rows("the job waits until it starts, and you are told if it does not" in outcome.output_text, "starts it again" not in outcome.output_text)


def test_a_worker_whose_job_waits_to_start_is_not_listed_as_running(worker_with_waiting_job):
    story = worker_with_waiting_job
    listed = {view: [row["id"] for row in json.loads(story.run(f"agent cards --environment main --show {view} --json", actor=story.agent).output_text).get("rows", [])] for view in ("running", "idle")}
    story.expect_rows(story.worker.id not in listed["running"], story.worker.id in listed["idle"])


def test_the_start_launcher_a_pid_records_the_workers_process(running_worker):
    running_worker.expect_text(f"agent show {running_worker.worker.id}", f"pid: {WORKER_PID}", "process_started_at: 2026-10-31T09:00:00")


def test_a_worker_whose_end_hook_was_lost_is_ended_at_a_tick(ended_worker):
    ended_worker.expect_text(f"agent show {ended_worker.worker.id}", "ended_at: 2026")


def test_a_running_worker_is_not_ended_at_a_tick(running_worker):
    running_worker.tick(MAIN_SESSION)
    running_worker.expect_no_text(f"agent show {running_worker.worker.id}", "ended_at:")


def test_a_send_after_a_tick_ended_the_worker_restarts_it(ended_worker):
    ended_worker.expect_rows(ended_worker.row(Agent, ended_worker.worker.id).ended_at is not None)
    launcher = start_launcher(ended_worker, f"started {WORKER_PID}\n".encode())
    ended_worker.expect_success(f'worker send --wait {ended_worker.worker.id} "Add the tax"', actor=ended_worker.agent)
    ended_worker.run_listeners()
    expect_restart(ended_worker, launcher)


def test_a_send_finds_a_process_gone_before_the_tick_does_and_restarts_the_worker(running_worker):
    running_worker.use_processes()
    launcher = start_launcher(running_worker, b"started\n")
    running_worker.expect_text(f'worker send --wait {running_worker.worker.id} "Add the tax"', "was not running: the job waits until it starts", actor=running_worker.agent)
    running_worker.run_listeners()
    expect_restart(running_worker, launcher)


def test_a_send_to_a_running_worker_says_it_takes_the_job(running_worker):
    running_worker.expect_success(f'worker send --wait {running_worker.worker.id} "Add the tax"', f"worker {running_worker.worker.id} takes the job", actor=running_worker.agent)


def test_a_send_to_a_worker_with_no_recorded_process_says_the_journal_cannot_tell(worker_story):
    worker = dispatched_worker(worker_story)
    worker_story.expect_text(f'worker send --wait {worker.id} "Add the tax"', "its process is not recorded, so the journal cannot say whether it runs", f"journal worker status {worker.id}", actor=worker_story.agent)


def test_a_send_with_no_launcher_says_the_worker_is_not_running(ended_worker):
    ended_worker.home.socket(LAUNCHER_SOCKET).unlink(missing_ok=True)
    ended_worker.expect_text(f'worker send --wait {ended_worker.worker.id} "Add the tax"', "is not running and has the job waiting", "needs the launcher", actor=ended_worker.agent)


def test_a_restarted_worker_keeps_its_new_process_through_its_first_hook(ended_worker):
    worker = ended_worker.worker
    stop_launcher = replaced_launcher(ended_worker, b"running\n", b"running\n")
    ended_worker.run_listeners()
    stop_launcher.drain_requests()
    stop_launcher.server.close()
    new_process = ProcessRow(WORKER_PID + 1, 1, RUNNING_PROGRAM.started_at)
    ended_worker.use_processes(new_process)
    launcher = start_launcher(ended_worker, f"started {new_process.pid}\n".encode())
    ended_worker.expect_success(f'worker send --wait {worker.id} "Add the tax"', actor=ended_worker.agent)
    ended_worker.run_listeners()
    launcher.drain_requests()
    ended_worker.hook(worker_session(ended_worker, worker), HookSamples.session_start())
    ended_worker.expect_text(f"agent show {worker.id}", f"pid: {new_process.pid}")
    ended_worker.expect_no_text(f"agent show {worker.id}", "ended_at:")
    ended_worker.tick(MAIN_SESSION)
    ended_worker.expect_no_text(f"agent show {worker.id}", "ended_at:")


def test_a_launcher_that_answers_no_pid_leaves_no_old_process_on_the_worker(running_worker):
    worker = running_worker.worker
    running_worker.expect_success(f"agent end {worker.id}", actor=running_worker.agent)
    launcher = start_launcher(running_worker, b"started\n")
    running_worker.expect_text(f'worker send --wait {worker.id} "Add the tax"', "the job waits until it starts", actor=running_worker.agent)
    running_worker.run_listeners()
    launcher.drain_requests()
    running_worker.expect_no_text(f"agent show {worker.id}", "pid:")


def test_a_send_to_a_paused_worker_says_it_waits_for_the_resume(running_worker):
    worker = running_worker.worker
    running_worker.expect_success(f"agent pause {worker.id}", actor=running_worker.agent)
    running_worker.use_processes()
    running_worker.expect_text(f'worker send --wait {worker.id} "Add the tax"', "is paused: the job waits until journal agent resume", actor=running_worker.agent)


def test_a_helper_whose_end_hook_was_lost_is_ended_at_a_tick(new_story):
    story = new_story(fixture=UserBuilder)
    story.use_processes(RUNNING_PROGRAM)
    launcher = start_launcher(story, f"started {WORKER_PID}\n".encode())
    helper = story.new_row_id('helper start journal-researcher --brief "Read src/cart.py" --environment main', actor=story.agent)
    story.run_listeners()
    launcher.drain_requests()
    story.expect_text(f"agent show {helper}", f"pid: {WORKER_PID}")
    story.use_processes()
    story.tick(MAIN_SESSION)
    story.expect_text(f"agent show {helper}", "ended_at: 2026")

