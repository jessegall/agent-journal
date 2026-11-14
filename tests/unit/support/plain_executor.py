from engine.process.door.execution_admission import ExecutionAdmission
from contextlib import nullcontext
from engine.log.error_log import ErrorLog
from engine.process.door.execution import Execution
from engine.process.door.execution_request import ExecutionRequest
from engine.process.door.execution_gate import ExecutionGate
from engine.process.door.placed_run import PlacedRun
from engine.process.door.process_executor import ProcessExecutor
from engine.process.door.run_placement import RunPlacement
from engine.process.door.runner_program import RunnerProgram


class OpenAdmission(ExecutionAdmission):
    """An admission with no server lanes: every run starts at once."""

    def __init__(self) -> None:
        pass

    def admitted(self, run):
        return nullcontext()


class OpenGate(ExecutionGate):
    """A server that is always ready, for a unit test with no journal home."""

    def __init__(self) -> None:
        pass

    def opened(self, run: PlacedRun) -> bool:
        return True


class SilentErrors(ErrorLog):
    """An error log that keeps nothing, for a unit test with no journal home."""

    def __init__(self) -> None:
        pass

    def recorded(self, argv: list[str], error: BaseException, environment_id: int | None) -> None:
        return None


class WaitingPlacement(RunPlacement):
    """Leaves every run's row waiting for its place in the long lane, as a merge's row waits, and keeps each end."""

    def __init__(self, is_waiting: bool) -> None:
        self.is_waiting = is_waiting
        self.ended_runs: list[Execution] = []

    def placed(self, request: ExecutionRequest) -> PlacedRun:
        return PlacedRun(request, 1, True, is_waiting=self.is_waiting)

    def ended(self, run: PlacedRun, execution: Execution) -> int | None:
        self.ended_runs.append(execution)
        return run.process_id


def plain_executor() -> ProcessExecutor:
    return ProcessExecutor(RunPlacement(), RunnerProgram(), OpenGate(), SilentErrors(), OpenAdmission())
