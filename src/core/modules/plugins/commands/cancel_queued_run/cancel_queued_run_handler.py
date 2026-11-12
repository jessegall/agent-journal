from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from engine.errors.refusal import Refusal
from engine.query.queries import Queries
from core.modules.plugins.commands.cancel_queued_run.cancel_queued_run import CancelQueuedRun
from core.modules.plugins.models.queued_run import QueuedRun
from core.modules.processes.commands.stop_process.stop_process import StopProcess


class CancelQueuedRunHandler(Handler[CancelQueuedRun, QueuedRun]):
    """Stops the process of a queued run that is not over; its end records the run cancelled."""

    command = CancelQueuedRun

    def __init__(self, queries: Queries, bus: Bus) -> None:
        self.queries, self.bus = queries, bus

    def handle(self, command: CancelQueuedRun, context: Context) -> QueuedRun:
        run = self.queries.query(QueuedRun).find(command.run_id)
        if run.state.is_over:
            raise Refusal(f"run {run.id} is over already: it {run.state.value}")
        self.bus.dispatch(StopProcess(run.process_id), context)
        return self.queries.query(QueuedRun).find(run.id)
