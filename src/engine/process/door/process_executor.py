from engine.process.door.execution_admission import ExecutionAdmission
from dataclasses import replace

from engine.errors.refusal import Refusal
from engine.errors.run_time_limit_error import RunTimeLimitError
from engine.log.error_log import ErrorLog
from engine.process.door.execution import Execution
from engine.process.door.execution_gate import ExecutionGate
from engine.process.door.execution_request import ExecutionRequest
from engine.process.door.placed_run import PlacedRun
from engine.process.door.run_placement import RunPlacement
from engine.process.door.runner_program import RunnerProgram

TIME_LIMIT_EXIT_CODE = 124


class ProcessExecutor:
    """The one door every program the journal runs goes through: the queue admits it as its row, the gate holds
    it while the server starts or updates and refuses it for a paused agent, the run takes its ticket, the runner
    runs it, and its end is recorded, also when it fails or passes its time limit."""

    def __init__(self, placement: RunPlacement, runner: RunnerProgram, gate: ExecutionGate, errors: ErrorLog, admission: ExecutionAdmission) -> None:
        self.placement, self.runner, self.gate, self.errors, self.admission = placement, runner, gate, errors, admission

    def execute(self, request: ExecutionRequest) -> Execution:
        placed = self.placement.placed(request)
        try:
            placed.refuse_hook_wait()
            self.gate.opened(placed)
            with self.placement.admitted(placed), self.admission.admitted(placed):
                execution = self.runner.run(placed)
        except RunTimeLimitError as error:
            self.recorded(placed, placed.failed(TIME_LIMIT_EXIT_CODE, str(error)))
            raise
        except Refusal as refusal:
            self.recorded(placed, placed.failed(Refusal.exit_code, str(refusal)))
            raise
        except BaseException:
            self.recorded(placed, placed.failed(1, "the run failed to start"))
            raise
        return replace(execution, process_id=self.recorded(placed, execution))

    def recorded(self, placed: PlacedRun, execution: Execution) -> int | None:
        try:
            return self.placement.ended(placed, execution)
        except Exception as failure:
            self.errors.recorded(["record-run", placed.request.text], failure, None)
            return None
