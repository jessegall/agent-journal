from engine.log.error_log import ErrorLog
from engine.process.door.execution_gate import ExecutionGate
from engine.process.door.placed_run import PlacedRun
from engine.process.door.process_executor import ProcessExecutor
from engine.process.door.run_placement import RunPlacement
from engine.process.door.runner_program import RunnerProgram


class OpenGate(ExecutionGate):
    """A server that is always ready, for a unit test with no journal home."""

    def __init__(self) -> None:
        pass

    def opened(self) -> bool:
        return True


class SilentErrors(ErrorLog):
    """An error log that keeps nothing, for a unit test with no journal home."""

    def __init__(self) -> None:
        pass

    def recorded(self, argv: list[str], error: BaseException, environment_id: int | None) -> None:
        return None


def plain_executor() -> ProcessExecutor:
    return ProcessExecutor(RunPlacement(), RunnerProgram(), OpenGate(), SilentErrors())
