import tempfile
from dataclasses import replace
from pathlib import Path
from types import SimpleNamespace

import pytest

from core.modules.agents.commands.record_agent_launch_failure.record_agent_launch_failure import RecordAgentLaunchFailure
from core.modules.agents.commands.record_agent_process.record_agent_process import RecordAgentProcess
from core.modules.agents.models.agent import Agent
from core.modules.agents.models.enums.dispatch import Dispatch
from core.modules.agents.models.enums.standing_state import StandingState
from core.modules.agents.models.enums.stop_reason import StopReason
from core.modules.agents.models.enums.stopped import Stopped
from core.modules.agents.support.agent_dispatcher import ENDED_ROW_TEXT, OPENED_ROW_TEXT, AgentDispatcher
from core.modules.agents.support.agent_launch_guard import AgentLaunchGuard
from core.modules.agents.support.agent_launcher import AgentLauncher
from core.modules.agents.support.agent_program import AgentProgram
from core.modules.agents.support.agent_stops import AgentStops
from core.modules.agents.support.dispatch_policy import DispatchPolicy
from core.modules.agents.support.launcher_link import LauncherLink
from core.modules.agents.support.local_launcher_transport import LocalLauncherTransport
from core.modules.agents.support.program_exit import ProgramExit
from core.modules.agents.support.program_process import ProgramProcess
from core.modules.agents.testing.fake_launcher import FakeLauncher
from engine.process.leftover_process import LeftoverProcess
from engine.provider.launch_command import LaunchCommand
from engine.time.clock import Clock
from engine.time.timestamp import Timestamp

NOW = Timestamp.parsed("2026-10-31T09:00:00+00:00")
CONTEXT = SimpleNamespace(timestamp=NOW)
POLICY = SimpleNamespace(agent_policy=lambda: SimpleNamespace(pause_retention_roles=()))
STARTED = b"started 701\n"
RUNNING = b"running\n"
STOPPED = b"stopped\n"
NOTHING = b"\n"
COMMAND = LaunchCommand(arguments=("claude", "-p", "Read src/cart.py"), folder=Path("/work/journal"), variables={})
HELPER = Agent(id=41, environment_id=1, number=2, creator_id=1, session="s-1", program="claude", role="helper", profile="journal-researcher")
ENDED_HELPER = replace(HELPER, ended_at=NOW, launched_at=NOW)


class RecordingBus:
    """Keeps each command the dispatcher and the launcher run, and runs none."""

    def __init__(self) -> None:
        self.commands: list[object] = []

    def run(self, command: object, actor: object, environment_id: int | None = None) -> None:
        self.commands.append(command)


class RecordingRepository:
    """Keeps the rows the dispatcher wrote: each row it ended and each row it opened again."""

    def __init__(self) -> None:
        self.ended_ids, self.saved_rows, self.updates = list[int](), list[Agent](), list[dict[str, object]]()

    def save_change(self, row: Agent, changed: Agent, context: object) -> Agent:
        self.ended_ids.append(changed.id)
        return changed

    def save(self, row: Agent, context: object) -> Agent:
        self.saved_rows.append(row)
        return row

    def update(self, row: Agent, context: object, **fields: object) -> Agent:
        self.updates.append(fields)
        return replace(row, **fields)


class FakeAgentQuery:
    """Answers the read of agents that ended a short while ago with the rows it was given."""

    def __init__(self, rows: tuple[Agent, ...]) -> None:
        self.rows = rows

    def matching(self, condition: object) -> "FakeAgentQuery":
        return self

    def all_rows(self) -> tuple[Agent, ...]:
        return self.rows


class Parts:
    """A dispatcher over a launcher socket in a folder of its own, with what it ran and what it logged."""

    def __init__(self, recently_ended: tuple[Agent, ...] = (), open_agents: tuple[Agent, ...] = (), end_reason: str = "") -> None:
        self.folder = Path(tempfile.mkdtemp())
        self.bus, self.repository, self.log_lines = RecordingBus(), RecordingRepository(), list[str]()
        self.session_reasons = list[StopReason]()
        home = SimpleNamespace(socket=lambda name: self.folder / name)
        link = LocalLauncherTransport(LauncherLink(home, SimpleNamespace(start=lambda: False)))
        launcher = AgentLauncher(link, self.bus, AgentLaunchGuard(), SimpleNamespace(lockdown=lambda program: SimpleNamespace(is_active=False)))
        providers = SimpleNamespace(executable=lambda program: program)
        program = AgentProgram(providers, link, SimpleNamespace(rows=lambda: []), Clock())
        self.dispatcher = AgentDispatcher(
            launcher, program, link, providers, self.repository, POLICY, SimpleNamespace(running=lambda: open_agents),
            SimpleNamespace(current=lambda agent_id: SimpleNamespace(end_reason=end_reason), ended=lambda agent_id, reason, context: self.session_reasons.append(reason)), SimpleNamespace(find=lambda environment_id: SimpleNamespace(id=1, name="main")),
            SimpleNamespace(query=lambda model: FakeAgentQuery(recently_ended)), SimpleNamespace(timestamp=lambda: NOW),
            SimpleNamespace(write=lambda level, text: self.log_lines.append(text)), DispatchPolicy(AgentLaunchGuard(), AgentStops()))

    def launcher(self, *answers: bytes) -> FakeLauncher:
        return FakeLauncher.listening(self.folder / "launcher", request_count=len(answers), answers=answers)

    def ran(self, command_type: type) -> list[object]:
        return [command for command in self.bus.commands if isinstance(command, command_type)]


@pytest.fixture(autouse=True)
def no_recorded_process_runs(monkeypatch):
    monkeypatch.setattr(LeftoverProcess, "command_line", staticmethod(lambda pid: ""))


def test_a_start_records_the_process_the_launcher_started():
    parts = Parts()
    parts.launcher(STARTED)
    assert parts.dispatcher.start(ENDED_HELPER, COMMAND) is Dispatch.STARTED
    assert parts.ran(RecordAgentProcess) == [RecordAgentProcess(41, 701)]


def test_of_two_starts_of_one_agent_one_is_started_and_the_other_is_told_a_program_runs():
    parts = Parts()
    parts.launcher(STARTED, RUNNING)
    assert [parts.dispatcher.start(ENDED_HELPER, COMMAND), parts.dispatcher.start(ENDED_HELPER, COMMAND)] == [Dispatch.STARTED, Dispatch.RUNNING]
    assert len(parts.ran(RecordAgentProcess)) == 1


def test_a_start_with_no_launcher_fails_and_records_one_failure():
    parts = Parts()
    assert parts.dispatcher.start(ENDED_HELPER, COMMAND) is Dispatch.FAILED
    assert parts.ran(RecordAgentLaunchFailure) == [RecordAgentLaunchFailure(41)]


def test_a_stop_ends_the_row_only_once_the_launcher_has_no_program_of_the_agent():
    gone, running = Parts(), Parts()
    gone.launcher(STOPPED, NOTHING)
    running.launcher(STOPPED, RUNNING)
    assert gone.dispatcher.stop(HELPER, StopReason.PERSON, CONTEXT) is Stopped.PROGRAM_ENDED
    assert running.dispatcher.stop(HELPER, StopReason.PERSON, CONTEXT) is Stopped.PROGRAM_RUNNING
    assert (gone.repository.ended_ids, running.repository.ended_ids) == ([41], [])
    assert (gone.session_reasons, running.session_reasons) == ([StopReason.PERSON], [])


def test_the_exit_of_the_current_process_ends_the_row_and_the_exit_of_an_earlier_process_changes_nothing():
    current, earlier = Parts(), Parts()
    current.dispatcher.exited(replace(HELPER, pid=701), ProgramExit(0, pid=701), CONTEXT)
    earlier.dispatcher.exited(replace(HELPER, pid=701), ProgramExit(0, pid=650), CONTEXT)
    assert (current.repository.ended_ids, earlier.repository.ended_ids) == ([41], [])
    assert "process 650" in earlier.log_lines[0]


@pytest.mark.parametrize("agent, answer, stage, reason", [
    (ENDED_HELPER, RUNNING, StandingState.RUNNING, None),
    (replace(ENDED_HELPER, launch_failed_at=NOW), NOTHING, StandingState.FAILED, None),
    (ENDED_HELPER, NOTHING, StandingState.ENDED, "stopped by a person"),
    (replace(HELPER, launched_at=NOW), NOTHING, StandingState.STARTING, None),
    (HELPER, NOTHING, StandingState.UNSTARTED, None),
])
def test_the_standing_is_one_answer_from_the_launcher_and_the_row(agent, answer, stage, reason):
    parts = Parts(end_reason="stopped by a person")
    held = parts.launcher(answer)
    standing = parts.dispatcher.standing(agent)
    assert (standing.stage, standing.reason, len(held.requests)) == (stage, reason, 1)


def test_reconcile_opens_a_row_that_ended_while_its_program_runs_and_records_it():
    parts = Parts(recently_ended=tuple([ENDED_HELPER]))
    parts.launcher(RUNNING)
    parts.dispatcher.reconcile(CONTEXT)
    assert [(row.id, row.ended_at) for row in parts.repository.saved_rows] == [(41, None)]
    assert parts.log_lines == [f"helper 2 {OPENED_ROW_TEXT}"]


def test_reconcile_ends_an_open_row_whose_started_program_is_gone_and_leaves_one_never_started():
    started, unstarted = replace(HELPER, launched_at=NOW), replace(HELPER, id=42, number=3)
    parts = Parts(open_agents=(started, unstarted))
    parts.launcher(NOTHING)
    parts.dispatcher.reconcile(CONTEXT)
    assert parts.repository.ended_ids == [41]
    assert f"helper 2 {ENDED_ROW_TEXT}" in parts.log_lines


def test_the_dispatcher_writes_the_opening_of_a_row_the_process_of_a_session_and_the_record_of_a_launch():
    parts, process = Parts(), ProgramProcess(701, NOW)
    parts.dispatcher.open_row(replace(ENDED_HELPER, pid=650), CONTEXT)
    parts.dispatcher.record_process(ENDED_HELPER, process, CONTEXT)
    parts.dispatcher.record_launch(replace(ENDED_HELPER, launch_failed_at=NOW), process, CONTEXT)
    assert [(row.ended_at, row.pid, row.process_started_at) for row in parts.repository.saved_rows] == [(None, 650, None), (None, 701, NOW)]
    assert parts.repository.updates == [{"pid": 701, "ended_at": None, "process_started_at": NOW, "launched_at": NOW, "launch_failed_at": None}]


def test_an_agent_whose_recorded_process_is_gone_ends_unless_the_launcher_has_its_program():
    gone, launched = Parts(), Parts()
    gone.launcher(NOTHING)
    launched.launcher(RUNNING)
    gone.dispatcher.end_lost_process(replace(HELPER, pid=700), CONTEXT)
    launched.dispatcher.end_lost_process(replace(HELPER, pid=700), CONTEXT)
    assert (gone.repository.ended_ids, gone.repository.updates[0]["pid"]) == ([41], None)
    assert (launched.repository.ended_ids, launched.repository.updates) == ([], [])
