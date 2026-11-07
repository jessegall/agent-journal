import json
from suites.coding.modules.workers.support.worker_job import SILENT_AGENT_SOURCE
from collections.abc import Callable
from dataclasses import dataclass, field
from datetime import timedelta

import pytest

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.database.database import Database
from core.base.database.statement import Statement
from core.base.leftover_process import LeftoverProcess
from core.base.query.queries import Queries
from core.modules.agents.support.launcher_link import LauncherLink
from core.modules.agents.support.terminal_typing import TerminalTyping
from core.modules.drivers.models.agent_line import AgentLine
from core.base.driver.command_category import CommandCategory
from core.testing.hook_samples import HookSamples
from core.testing.story import Story
from suites.coding.modules.workers.ticks.worker_resume_retry import WorkerResumeRetry
from tests.stories.core.modules.processes.support.process_samples import start_process
from tests.stories.server.support.server_client import server_story, viewer_answer
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment, worker_session
from tests.stories.suites.coding.modules.workers.report import OrchestratorWithMergerOff
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import repository_folder
from tests.stories.suites.coding.modules.workers.support.git_repository import GitRepository

RECOVERY_SOURCE = "workers.silent-agent"
FAILED_SOURCE = "workers.silent-agent-failed"
SILENT_SECONDS = 180
WORKER_PID = 9123


@dataclass
class RecoveryCase:
    """A worker, a replaceable connection answer and recorded launch requests."""

    story: Story
    worker: Actor
    session: str
    online: bool = True
    process_running: bool = False
    stop_blocked: bool = False
    launches: list[dict[str, object]] = field(default_factory=list)
    terminal_lines: list[tuple[int, str]] = field(default_factory=list)
    stopped: list[int] = field(default_factory=list)
    on_launch: Callable[[], None] | None = None

    def request(self, link, request, answer_bytes=0):
        if "typed" in request:
            self.terminal_lines.append((request["agent_id"], request["typed"]))
            return b"typed"
        if "command" in request:
            self.launches.append(request)
            callback, self.on_launch = self.on_launch, None
            if callback is not None:
                callback()
        return b"started\n"

    def command_line(self, pid):
        return f"claude -p --resume {self.session}" if self.process_running and pid == WORKER_PID else ""

    def stop(self, pid, program):
        self.stopped.append(pid)
        if not self.stop_blocked:
            self.process_running = False

    def advance(self, seconds):
        self.story.advance(timedelta(seconds=seconds))

    def tick(self):
        WorkerResumeRetry()(self.story.container)
        self.story.tick("s-1")
        self.story.run_listeners()

    def lines(self, agent_id, source=RECOVERY_SOURCE):
        return list(self.story.container.get(Queries).query(AgentLine).filter(session_agent_id=agent_id, source=source).all_rows())


@pytest.fixture
def recovery(new_story, monkeypatch):
    from core.base.connection_probe import ConnectionProbe

    story = new_story(fixture=OrchestratorWithMergerOff)
    repository_environment(story)
    worker = dispatched_worker(story)
    session = worker_session(story, worker)
    case = RecoveryCase(story, worker, session)
    monkeypatch.setattr(ConnectionProbe, "is_online", lambda probe: case.online)
    monkeypatch.setattr(LauncherLink, "sent", lambda link, request, answer_bytes=0: case.request(link, request, answer_bytes))
    monkeypatch.setattr(TerminalTyping, "type_line", lambda typing, agent_id, line: case.terminal_lines.append((agent_id, line)))
    monkeypatch.setattr(LeftoverProcess, "command_line", case.command_line)
    monkeypatch.setattr(LeftoverProcess, "stop", case.stop)
    story.hook(session, HookSamples.prompt("Finish the assigned task"))
    return case



@pytest.fixture
def offline_recovery(recovery):
    recovery.online = False
    recovery.tick()
    recovery.advance(SILENT_SECONDS)
    return recovery


@pytest.fixture
def running_command_recovery(recovery):
    recovery.story.expect_success("setting set journal.core.processes.readers-forced off --environment main")
    recovery.story.expect_success("setting set journal.suites.coding.workers.worker-run-most-tests 0 --environment main")
    return recovery


@pytest.fixture
def reconnected_recovery(offline_recovery):
    offline_recovery.online = True
    offline_recovery.tick()
    offline_recovery.tick()
    return offline_recovery


@pytest.fixture
def running_recovery(recovery):
    recovery.story.expect_success(f"agent edit {recovery.worker.id} --pid {WORKER_PID}")
    recovery.process_running = True
    return recovery


@pytest.fixture
def first_recovery(recovery):
    recovery.advance(SILENT_SECONDS)
    recovery.tick()
    return recovery


@pytest.fixture(params=[False, True])
def resumed_running_worker(running_recovery, request):
    running_recovery.stop_blocked = request.param
    running_recovery.advance(SILENT_SECONDS)
    running_recovery.tick()
    running_recovery.tick()
    return running_recovery


@pytest.fixture
def nested_recovery(recovery):
    recovery.story.expect_success(f"agent end {recovery.worker.id}", actor=recovery.worker)
    recovery.launches.clear()
    recovery.on_launch = lambda: recovery.story.expect_success(
        f'worker send --wait {recovery.worker.id} "Continue the assigned task"', actor=recovery.story.agent)
    recovery.advance(SILENT_SECONDS)
    recovery.tick()
    return recovery

def test_a_reconnection_resumes_a_silent_worker_once(reconnected_recovery):
    recovery = reconnected_recovery
    recovery.story.expect_rows(len(recovery.launches) == 1, len(recovery.lines(recovery.worker.id)) == 1)
    recovery.story.expect_rows(not any(agent_id == recovery.worker.id for agent_id, line in recovery.terminal_lines))


def test_a_running_or_queued_shell_command_prevents_recovery(running_command_recovery):
    recovery = running_command_recovery
    recovery.story.agent = recovery.worker
    process = start_process(recovery.story, "sleep 30", category=CommandCategory.TEST_RUN)
    recovery.online = False
    recovery.tick()
    recovery.advance(SILENT_SECONDS)
    recovery.online = True
    recovery.tick()
    recovery.story.expect_rows(not recovery.launches, not recovery.lines(recovery.worker.id))


def test_silent_recovery_waits_for_a_growing_gap_and_stops_after_three_attempts(first_recovery):
    recovery = first_recovery
    recovery.story.expect_rows(len(recovery.launches) == 1)
    recovery.advance(SILENT_SECONDS * 2 - 1)
    recovery.tick()
    recovery.story.expect_rows(len(recovery.launches) == 1)
    recovery.advance(1)
    recovery.tick()
    recovery.story.expect_rows(len(recovery.launches) == 2)
    recovery.advance(SILENT_SECONDS * 4)
    recovery.tick()
    recovery.story.expect_rows(len(recovery.launches) == 3)
    recovery.advance(SILENT_SECONDS * 8)
    recovery.tick()
    recovery.tick()
    recovery.story.expect_rows(len(recovery.launches) == 3)
    notices = recovery.lines(recovery.story.agent.id, FAILED_SOURCE)
    rows = json.loads(recovery.story.run("merger-line list --json", actor=recovery.story.agent).output_text)["rows"]
    matching = [row for row in rows if f"agent:{recovery.worker.id} could not resume" in row["text"]]
    recovery.story.expect_rows(len(matching) == 1, "three waking lines got no hook" in matching[0]["text"],
                               any(f'merger-line:{matching[0]["id"]}' in line.text for line in notices))



def test_a_live_worker_must_stop_before_its_session_can_resume(resumed_running_worker):
    recovery = resumed_running_worker
    recovery.story.expect_rows(recovery.stopped == [WORKER_PID])
    if recovery.stop_blocked:
        recovery.story.expect_rows(not recovery.launches, recovery.process_running)
        recovery.story.expect_rows(len(recovery.lines(recovery.story.agent.id, FAILED_SOURCE)) == 1)
    else:
        recovery.story.expect_rows(not recovery.process_running, len(recovery.launches) == 1)

def test_worker_send_does_not_resume_a_session_whose_process_is_still_active(recovery):
    recovery.process_running = True
    recovery.story.expect_success(f"agent edit {recovery.worker.id} --pid {WORKER_PID}")
    recovery.story.expect_text(f"agent show {recovery.worker.id}", f"pid: {WORKER_PID}")
    recovery.story.expect_success(f"agent end {recovery.worker.id}", actor=recovery.worker)
    recovery.story.expect_text(f"agent show {recovery.worker.id}", f"pid: {WORKER_PID}")
    recovery.advance(121)
    recovery.story.expect_success(f'worker send --wait {recovery.worker.id} "Go on with task 1"', actor=recovery.story.agent)
    recovery.story.run_listeners()
    recovery.story.expect_rows(not recovery.launches, not recovery.stopped)


def test_a_terminal_agent_with_its_own_task_gets_a_typed_waking_line(recovery):
    recovery.story.expect_success("setting set journal.suites.coding.auto-mode on --environment main", actor=recovery.story.user)
    recovery.story.expect_success('task make "Main work" --brief "Finish the main task" --environment main')
    recovery.story.expect_success("task start 2", actor=recovery.story.agent)
    recovery.advance(SILENT_SECONDS)
    recovery.tick()
    recovery.story.expect_rows(any(agent_id == recovery.story.agent.id for agent_id, line in recovery.terminal_lines))


def test_the_connection_state_is_available_to_the_viewer(offline_recovery):
    import json

    recovery = offline_recovery
    with server_story(recovery.story) as server:
        status, headers, text = viewer_answer(server.viewer_port(), "/api/server-state", "", "")
        recovery.story.expect_rows(status == 200, json.loads(text)["connection"] == "offline")
        recovery.online = True
        recovery.advance(10)
        recovery.tick()
        status, headers, text = viewer_answer(server.viewer_port(), "/api/server-state", "", "")
        recovery.story.expect_rows(status == 200, json.loads(text)["connection"] == "online")


@pytest.mark.parametrize("line", [
    'question ask "Which database?" --context "A story asks this so its card and answer can be checked." --options sqlite postgres --environment main',
    'review request task 1 --points 1 --environment main',
])
def test_a_worker_waiting_for_an_answer_or_review_is_not_restarted(recovery, line):
    target = recovery.story.agent if line.startswith("question ") else recovery.worker
    recovery.story.expect_success(line, actor=target)
    recovery.advance(SILENT_SECONDS)
    recovery.tick()
    recovery.story.expect_rows(not recovery.lines(target.id), not any(request["agent_id"] == target.id for request in recovery.launches))


def test_any_recent_hook_prevents_silence_recovery(recovery):
    recovery.advance(SILENT_SECONDS - 1)
    recovery.story.hook(recovery.session, HookSamples.prompt("Still working"))
    recovery.advance(SILENT_SECONDS - 1)
    recovery.tick()
    recovery.story.expect_rows(not recovery.launches)


def test_the_silence_setting_changes_the_first_wake_delay(recovery):
    recovery.story.expect_success("setting set journal.suites.coding.workers.silent-agent-minutes 6 --environment main")
    recovery.advance(SILENT_SECONDS)
    recovery.tick()
    recovery.story.expect_rows(not recovery.launches)
    recovery.advance(SILENT_SECONDS)
    recovery.tick()
    recovery.story.expect_rows(len(recovery.launches) == 1)


def test_reconnection_wakes_each_silent_worker_with_work(recovery):
    task_id = recovery.story.new_row_id('task make "Second job" --brief "Finish it" --environment main')
    second = dispatched_worker(recovery.story, f"worker dispatch --model sonnet {task_id}")
    recovery.launches.clear()
    recovery.online = False
    recovery.tick()
    recovery.advance(SILENT_SECONDS)
    recovery.online = True
    recovery.tick()
    recovery.story.expect_rows({request["agent_id"] for request in recovery.launches} == {recovery.worker.id, second.id})


def test_a_second_wake_during_a_session_launch_does_not_start_another_process(nested_recovery):
    nested_recovery.story.expect_rows(len(nested_recovery.launches) == 1)


def test_a_silent_main_agent_with_open_tasks_is_woken_under_auto_mode(recovery):
    story = recovery.story
    story.expect_success('task make "For later" --environment main', actor=story.agent)
    recovery.advance(SILENT_SECONDS + 1)
    recovery.tick()
    story.expect_rows(len(recovery.lines(story.agent.id, SILENT_AGENT_SOURCE)) == 1)


def test_a_silent_main_agent_is_not_woken_for_open_tasks_with_auto_mode_off(recovery):
    story = recovery.story
    story.expect_success("setting set journal.suites.coding.auto-mode off --environment main")
    story.expect_success('task make "For later" --environment main', actor=story.agent)
    recovery.advance(SILENT_SECONDS + 1)
    recovery.tick()
    story.expect_rows(recovery.lines(story.agent.id, SILENT_AGENT_SOURCE) == [])



def test_a_stopped_worker_with_work_is_reported_after_fifteen_minutes_and_every_five_minutes(recovery, monkeypatch):
    story, worker = recovery.story, recovery.worker
    monkeypatch.setattr(recovery, "request", lambda *_args: b"failed\n")
    story.expect_success(f"agent end {worker.id}", actor=worker)
    line = f"worker:{worker.id} has stopped"
    recovery.advance(14 * 60)
    story.tick("s-1")
    story.expect_no_text(f"agent-line list --agent {story.agent.id}", line)
    recovery.advance(60)
    story.tick("s-1")
    notices = story.run(f"agent-line list --agent {story.agent.id}").output_text
    story.expect_rows(notices.count(line) == 1, detail=notices)
    recovery.advance(5 * 60)
    story.tick("s-1")
    story.expect_rows(story.run(f"agent-line list --agent {story.agent.id}").output_text.count(line) == 2)
    story.hook(recovery.session, HookSamples.prompt("Continue the task"))
    story.tick("s-1")
    story.expect_rows(story.run(f"agent-line list --agent {story.agent.id}").output_text.count(line) == 2)


def test_a_paused_worker_is_not_reported_as_stopped(recovery):
    story, worker = recovery.story, recovery.worker
    story.expect_success(f"agent pause {worker.id}", actor=story.user)
    recovery.advance(20 * 60)
    story.tick("s-1")
    story.expect_no_text(f"agent-line list --agent {story.agent.id}", f"worker:{worker.id} has stopped")


def test_a_delivery_without_tests_passed_is_reported_as_stopped(recovery):
    story, worker = recovery.story, recovery.worker
    GitRepository(repository_folder(story)).changed(worker.id, "cart.py", "TOTAL = 3\n")
    story.expect_success('proof make 1 --task 1 "cart.py:1, checked"', actor=worker)
    story.expect_success("proof check 1", actor=story.agent)
    story.expect_success("worker deliver --wait --differences none", actor=worker)
    story.container.get(Database).update(Statement("UPDATE worker_worktrees SET tests_passed_at = NULL WHERE session_agent_id = ?", [worker.id]))
    story.expect_success(f"agent end {worker.id}", actor=worker)
    recovery.advance(20 * 60)
    story.tick("s-1")
    story.expect_text(f"agent-line list --agent {story.agent.id}", f"worker:{worker.id} has stopped")


def test_the_stopped_worker_warning_intervals_are_settings(recovery, monkeypatch):
    story, worker = recovery.story, recovery.worker
    monkeypatch.setattr(recovery, "request", lambda *_args: b"failed\n")
    story.expect_success("setting set journal.suites.coding.workers.idle-worker-minutes 2 --environment main", actor=story.user)
    story.expect_success("setting set journal.suites.coding.workers.idle-worker-repeat-minutes 1 --environment main", actor=story.user)
    story.expect_success(f"agent end {worker.id}", actor=worker)
    line = f"worker:{worker.id} has stopped"
    recovery.advance(2 * 60)
    story.tick("s-1")
    notices = story.run(f"agent-line list --agent {story.agent.id}").output_text
    story.expect_rows(notices.count(line) == 1, detail=notices)
    recovery.advance(60)
    story.tick("s-1")
    story.expect_rows(story.run(f"agent-line list --agent {story.agent.id}").output_text.count(line) == 2)


def test_a_stopped_worker_with_a_running_command_is_not_reported(running_command_recovery):
    recovery = running_command_recovery
    story, worker = recovery.story, recovery.worker
    main = story.agent
    story.agent = worker
    start_process(story, "sleep 30", category=CommandCategory.TEST_RUN)
    story.agent = main
    story.expect_success(f"agent end {worker.id}", actor=worker)
    recovery.advance(20 * 60)
    story.tick("s-1")
    story.expect_no_text(f"agent-line list --agent {main.id}", f"worker:{worker.id} has stopped")


def test_a_worker_waiting_for_a_place_is_not_reported_and_starts_when_a_place_frees(recovery):
    story, worker = recovery.story, recovery.worker
    story.expect_success(f"agent end {worker.id}", actor=worker)
    story.expect_success("setting set journal.suites.coding.workers.worker-run-limit 0 --environment main", actor=story.user)
    recovery.advance(1)
    story.expect_success(f'worker send --wait {worker.id} "Continue the task"', actor=story.agent)
    recovery.advance(20 * 60)
    story.tick("s-1")
    story.expect_no_text(f"agent-line list --agent {story.agent.id}", f"worker:{worker.id} has stopped")
    story.expect_success("setting set journal.suites.coding.workers.worker-run-limit 2 --environment main", actor=story.user)
    WorkerResumeRetry()(story.container)
    story.expect_rows(len(recovery.launches) > 0)


def test_a_worker_stopped_by_a_person_is_not_restarted_for_its_old_job(recovery):
    story, worker = recovery.story, recovery.worker
    recovery.launches.clear()
    person = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    story.expect_success(f"agent end {worker.id}", actor=person)
    recovery.advance(20 * 60)
    WorkerResumeRetry()(story.container)
    story.expect_rows(not recovery.launches, detail=str(recovery.launches))
    story.tick("s-1")
    story.expect_text(f"agent-line list --agent {story.agent.id}", f"worker:{worker.id} has stopped")
