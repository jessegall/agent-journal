from pathlib import Path
from types import SimpleNamespace

import pytest

from engine.actor.actor import Actor
from engine.caller.process_command import ProcessCommand
from engine.command.context import Context
from engine.enums.actor_type import ActorType
from engine.time.timestamp import Timestamp
from engine.process.leftover_process import LeftoverProcess
from core.modules.agents.commands.stop_unused_launcher.stop_unused_launcher import StopUnusedLauncher
from core.modules.agents.commands.stop_unused_launcher.stop_unused_launcher_handler import StopUnusedLauncherHandler
from core.modules.agents.support.launcher_processes import LauncherProcesses

HOME = Path("/made-up/project/.journal")
LAUNCHER = (str(HOME / "bin" / "journal"), "launcher-service")
DIFFERENT_JOURNAL_LAUNCHER = ("/made-up/shop/.journal/bin/journal", "launcher-service")
ACTOR = Actor(9, ActorType.MODULE)
CONTEXT = Context(Actor.core(), Timestamp.parsed("2026-10-31T09:00:00+00:00"), StopUnusedLauncher(7001, 7002))
TERMINAL_PID, FIRST_PID, SECOND_PID, THIRD_PID, PROGRAM_PID = 6900, 7001, 7002, 7003, 7100


def processes(rows: list[ProcessCommand], owner_pid: int | None = None) -> LauncherProcesses:
    return LauncherProcesses(SimpleNamespace(folder=HOME), SimpleNamespace(commands=lambda: rows), SimpleNamespace(owner_pid=owner_pid))


def pairs(rows: list[ProcessCommand], owner_pid: int | None = None) -> list[tuple[int, int]]:
    return [(serving.pid, unused.pid) for serving, unused in processes(rows, owner_pid).unused()]


def test_a_second_launcher_nothing_started_and_nothing_runs_under_is_unused_beside_the_one_that_serves():
    rows = [ProcessCommand(FIRST_PID, 1, LAUNCHER), ProcessCommand(SECOND_PID, 1, LAUNCHER)]
    assert pairs(rows) == [(FIRST_PID, SECOND_PID)]
    assert pairs(rows, owner_pid=SECOND_PID) == [(SECOND_PID, FIRST_PID)]


@pytest.mark.parametrize("rows", [
    [ProcessCommand(FIRST_PID, 1, LAUNCHER)],
    [ProcessCommand(FIRST_PID, 1, LAUNCHER), ProcessCommand(SECOND_PID, 1, DIFFERENT_JOURNAL_LAUNCHER)],
    [ProcessCommand(FIRST_PID, TERMINAL_PID, LAUNCHER), ProcessCommand(SECOND_PID, FIRST_PID, LAUNCHER), ProcessCommand(THIRD_PID, SECOND_PID, LAUNCHER)],
    [ProcessCommand(FIRST_PID, 1, LAUNCHER), ProcessCommand(SECOND_PID, 1, LAUNCHER), ProcessCommand(PROGRAM_PID, SECOND_PID, ("claude", "-p"))],
])
def test_one_launcher_a_launcher_of_another_journal_a_chain_under_a_terminal_and_a_launcher_with_a_program_are_left_alone(rows):
    assert pairs(rows, owner_pid=FIRST_PID) == []


def test_the_unused_launcher_is_stopped_the_first_time_it_is_shown_and_never_the_one_that_serves(monkeypatch):
    stopped, shown = list[tuple[int, str]](), list[str]()
    monkeypatch.setattr(LeftoverProcess, "stop", lambda pid, program: stopped.append((pid, program)) or True)
    bus = SimpleNamespace(dispatch=lambda command, context: shown.append(command.key))
    marks = SimpleNamespace(query=lambda model: SimpleNamespace(filter=lambda key: SimpleNamespace(exists=lambda: key in shown)))
    handler = StopUnusedLauncherHandler(bus, marks, processes([]), SimpleNamespace(actor=lambda module: ACTOR))
    handler.handle(StopUnusedLauncher(FIRST_PID, SECOND_PID), CONTEXT)
    handler.handle(StopUnusedLauncher(FIRST_PID, SECOND_PID), CONTEXT)
    assert stopped == [(SECOND_PID, LAUNCHER[0])]
    assert shown == [f"launchers:{FIRST_PID}:{SECOND_PID}"]
