from engine.process.execution_gate import ExecutionGate
from engine.process.placed_run import PlacedRun
from engine.process.process_executor import ProcessExecutor
from engine.process.run_placement import RunPlacement
from engine.process.runner_program import RunnerProgram


class OpenGate(ExecutionGate):
    """A server that is always ready, for a unit test with no journal home."""

    def __init__(self) -> None:
        pass

    def opened(self) -> bool:
        return True


def plain_executor() -> ProcessExecutor:
    return ProcessExecutor(RunPlacement(), RunnerProgram(), OpenGate())
