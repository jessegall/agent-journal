from pathlib import Path

import pytest

from engine.enums.process_kind import ProcessKind
from engine.errors.run_time_limit_error import RunTimeLimitError
from engine.process.execution import Execution
from engine.process.execution_gate import ExecutionGate
from engine.process.execution_request import ExecutionRequest
from engine.process.placed_run import PlacedRun
from engine.process.process_executor import ProcessExecutor
from engine.process.run_placement import RunPlacement
from engine.process.runner_program import RunnerProgram


class CountedPlacement(RunPlacement):
    """Gives each run a row number and a place when its kind takes one, and keeps how each ended."""

    def __init__(self) -> None:
        self.ended_runs: list[tuple[PlacedRun, Execution]] = []
        self.moved: list[int | None] = []

    def placed(self, request: ExecutionRequest) -> PlacedRun:
        return PlacedRun(request, len(self.ended_runs) + 1, request.kind.takes_place)

    def moved_to_background(self, run: PlacedRun, pid: int) -> None:
        self.moved.append(run.process_id)

    def ended(self, run: PlacedRun, execution: Execution) -> int | None:
        self.ended_runs.append((run, execution))
        return run.process_id


class OpenGate(ExecutionGate):
    """A server that is always ready."""

    def __init__(self) -> None:
        self.asked = 0

    def opened(self) -> bool:
        self.asked += 1
        return True


def executor() -> tuple[ProcessExecutor, CountedPlacement]:
    placement = CountedPlacement()
    return ProcessExecutor(placement, RunnerProgram(), OpenGate()), placement


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


def test_a_quick_run_past_its_limit_is_not_stopped_but_moves_to_the_background_on_its_own_row(tmp_path: Path):
    door, placement = executor()
    execution = door.execute(ExecutionRequest(["sh", "-c", "sleep 0.4; echo late"], tmp_path, ProcessKind.QUICK, 0.1))
    assert (execution.stdout, placement.moved, len(placement.ended_runs), placement.ended_runs[0][1].exit_code) == ("late\n", [1], 1, 0)
