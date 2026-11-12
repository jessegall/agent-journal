from contextlib import AbstractContextManager, nullcontext

from engine.process.door.execution import Execution
from engine.process.door.execution_request import ExecutionRequest
from engine.process.door.placed_run import PlacedRun


class RunPlacement:
    """Admits a run into the one process queue and records its end. With no processes module installed a run is admitted at once and leaves no row; the processes module binds
    the queue that makes the row and gives places, the main agent first."""

    def placed(self, request: ExecutionRequest) -> PlacedRun:
        return PlacedRun(request, None, False)

    def admitted(self, run: PlacedRun) -> AbstractContextManager[None]:
        """Holds the place of the run while it goes; with no processes module a run holds none."""
        return nullcontext()

    def ended(self, run: PlacedRun, execution: Execution) -> int | None:
        return None
