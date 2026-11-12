import time
from pathlib import Path

import pytest

from engine.enums.process_kind import ProcessKind
from engine.errors.run_time_limit_error import RunTimeLimitError
from engine.log.error_log import ErrorLog
from engine.process.door.execution import Execution
from engine.process.door.execution_gate import ExecutionGate
from engine.process.door.execution_request import ExecutionRequest
from engine.process.door.placed_run import PlacedRun
from engine.process.door.process_executor import ProcessExecutor
from engine.process.door.run_placement import RunPlacement
from engine.process.door.runner_program import RunnerProgram


class CountedPlacement(RunPlacement):
    """Gives each run a row number and a place when its kind takes one, and keeps how each ended."""

    def __init__(self) -> None:
        self.ended_runs: list[tuple[PlacedRun, Execution]] = []

    def placed(self, request: ExecutionRequest) -> PlacedRun:
        return PlacedRun(request, len(self.ended_runs) + 1, request.kind.takes_place)

    def ended(self, run: PlacedRun, execution: Execution) -> int | None:
        self.ended_runs.append((run, execution))
        return run.process_id


class NotedErrors(ErrorLog):
    """Keeps the errors it was told to record."""

    def __init__(self) -> None:
        self.noted: list[tuple[list[str], BaseException]] = []

    def recorded(self, argv: list[str], error: BaseException, environment_id: int | None) -> None:
        self.noted.append((argv, error))


class OpenGate(ExecutionGate):
    """A server that is always ready."""

    def __init__(self) -> None:
        self.asked = 0

    def opened(self) -> bool:
        self.asked += 1
        return True


def executor() -> tuple[ProcessExecutor, CountedPlacement]:
    placement = CountedPlacement()
    return ProcessExecutor(placement, RunnerProgram(), OpenGate(), NotedErrors()), placement


def test_a_run_goes_through_the_queue_and_its_end_is_recorded_with_its_row(tmp_path: Path):
    door, placement = executor()
    execution = door.execute(ExecutionRequest(["echo", "done"], tmp_path, ProcessKind.SHELL, 5))
    assert (execution.stdout, execution.process_id, placement.ended_runs[0][0].holds_place, placement.ended_runs[0][1].exit_code) == ("done\n", 1, True, 0)


def test_a_quick_run_and_a_priority_zero_run_get_a_row_and_take_no_place(tmp_path: Path):
    door, placement = executor()
    door.execute(ExecutionRequest(["true"], tmp_path, ProcessKind.QUICK, 5))
    door.execute(ExecutionRequest(["true"], tmp_path, ProcessKind.READ, 5))
    assert [(run.process_id, run.holds_place) for run, _ in placement.ended_runs] == [(1, False), (2, False)]


def test_a_run_past_its_limit_fails_naming_its_command_and_its_end_is_still_recorded(tmp_path: Path):
    door, placement = executor()
    with pytest.raises(RunTimeLimitError, match="sleep 5 ran past its limit of 0.2 seconds"):
        door.execute(ExecutionRequest(["sleep", "5"], tmp_path, ProcessKind.SHELL, 0.2))
    assert placement.ended_runs[0][1].exit_code == 124


def test_reading_writing_searching_and_hooks_never_move_to_the_background():
    assert [kind for kind in ProcessKind if not kind.can_go_to_background] == [ProcessKind.HOOK, ProcessKind.READ, ProcessKind.WRITE, ProcessKind.SEARCH]


def test_a_quick_run_past_its_limit_is_stopped_and_fails_naming_its_command(tmp_path: Path):
    door, placement = executor()
    with pytest.raises(RunTimeLimitError, match="sleep 5 ran past its limit of 1 seconds"):
        door.execute(ExecutionRequest(["sleep", "5"], tmp_path, ProcessKind.QUICK, 1))
    assert (len(placement.ended_runs), placement.ended_runs[0][1].exit_code) == (1, 124)


def test_a_run_past_its_limit_is_stopped_with_the_grandchild_that_holds_its_output_open(tmp_path: Path):
    door, _ = executor()
    started = time.monotonic()
    with pytest.raises(RunTimeLimitError):
        door.execute(ExecutionRequest(["sh", "-c", "sleep 30 & wait"], tmp_path, ProcessKind.SHELL, 1))
    assert time.monotonic() - started < 2.5


class BrokenPlacement(CountedPlacement):
    """A queue whose row cannot be written."""

    def ended(self, run: PlacedRun, execution: Execution) -> int | None:
        raise OSError("the row cannot be written")


def test_a_row_that_cannot_be_written_is_recorded_as_an_exception_and_the_answer_of_the_run_still_returns(tmp_path: Path):
    errors = NotedErrors()
    door = ProcessExecutor(BrokenPlacement(), RunnerProgram(), OpenGate(), errors)
    execution = door.execute(ExecutionRequest(["echo", "done"], tmp_path, ProcessKind.SHELL, 5))
    assert (execution.stdout, execution.process_id, [(argv, str(error)) for argv, error in errors.noted]) == ("done\n", None, [(["record-run", "echo done"], "the row cannot be written")])


def test_a_row_that_cannot_be_written_after_a_run_past_its_limit_does_not_hide_the_limit_error(tmp_path: Path):
    errors = NotedErrors()
    door = ProcessExecutor(BrokenPlacement(), RunnerProgram(), OpenGate(), errors)
    with pytest.raises(RunTimeLimitError, match="sleep 5 ran past its limit"):
        door.execute(ExecutionRequest(["sleep", "5"], tmp_path, ProcessKind.SHELL, 0.2))
    assert [argv for argv, _ in errors.noted] == [["record-run", "sleep 5"]]


def test_a_row_that_cannot_be_written_after_a_program_that_does_not_start_does_not_hide_the_os_error(tmp_path: Path):
    errors = NotedErrors()
    door = ProcessExecutor(BrokenPlacement(), RunnerProgram(), OpenGate(), errors)
    with pytest.raises(FileNotFoundError):
        door.execute(ExecutionRequest(["no-such-program-here"], tmp_path, ProcessKind.QUICK, 5))
    assert [argv for argv, _ in errors.noted] == [["record-run", "no-such-program-here"]]
