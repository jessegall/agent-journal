from dataclasses import replace

from engine.errors.run_time_limit_error import RunTimeLimitError
from engine.process.execution import Execution
from engine.process.execution_gate import ExecutionGate
from engine.process.execution_request import ExecutionRequest
from engine.process.placed_run import PlacedRun
from engine.process.run_placement import RunPlacement
from engine.process.runner_program import RunnerProgram

TIME_LIMIT_EXIT_CODE = 124


class ProcessExecutor:
    """The one door every program the journal runs goes through: the queue admits it as its row, the gate holds it
    while the server starts or updates, the runner runs it, and its end is recorded, also when it fails or passes
    its time limit."""

    def __init__(self, placement: RunPlacement, runner: RunnerProgram, gate: ExecutionGate) -> None:
        self.placement, self.runner, self.gate = placement, runner, gate

    def execute(self, request: ExecutionRequest) -> Execution:
        placed = self.placement.placed(request)
        self.gate.opened()
        try:
            execution = self.runner.run(placed, self.placement)
        except RunTimeLimitError as error:
            self.placement.ended(placed, Execution(placed.process_id, TIME_LIMIT_EXIT_CODE, "", str(error)))
            raise
        except BaseException:
            self.placement.ended(placed, Execution(placed.process_id, 1, "", "the run failed to start"))
            raise
        return replace(execution, process_id=self.recorded(placed, execution))

    def recorded(self, placed: PlacedRun, execution: Execution) -> int | None:
        try:
            return self.placement.ended(placed, execution)
        except Exception:
            return None
