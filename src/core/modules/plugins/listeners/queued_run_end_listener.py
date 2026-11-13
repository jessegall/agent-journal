from engine.time.timestamp import MILLISECONDS
from engine.command.context import Context
from engine.listener.save_listener import SaveListener
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.plugins.models.enums.queued_run_state import QueuedRunState
from core.modules.plugins.models.queued_run import QueuedRun
from core.modules.plugins.support.machine_runs import MachineRuns
from core.modules.processes.events.process_ended import ProcessEnded
from core.modules.processes.models.enums.process_state import ProcessState
from core.modules.processes.models.process import Process



class QueuedRunEndListener(SaveListener[ProcessEnded]):
    """Records how a queued run ended when its process ends: stopped at its timeout, cancelled, or ended by itself
    with its exit code, and how long it ran. That save is the event queued_run.ended a plugin listens to."""

    name = "plugins.queued-run-end"

    def __init__(self, queries: Queries, repository: Repository, machine: MachineRuns) -> None:
        self.queries, self.repository, self.machine = queries, repository, machine

    def handle(self, event: ProcessEnded, context: Context) -> None:
        process = event.row
        if not process.plugin:
            return
        run = self.queries.query(QueuedRun).filter(process_id=process.id).first()
        if run is None or run.state.is_over:
            return
        self.machine.release(process)
        self.repository.update(run, context, state=self.ending(process), exit_code=process.exit_code, duration_ms=self.duration_ms(process),
                               timed_out=process.expired_at is not None)

    @staticmethod
    def ending(process: Process) -> QueuedRunState:
        if process.expired_at is not None:
            return QueuedRunState.LIMIT_REACHED
        return QueuedRunState.CANCELLED if process.state is ProcessState.STOPPED else QueuedRunState.ENDED

    @staticmethod
    def duration_ms(process: Process) -> int:
        if process.started_at is None or process.ended_at is None:
            return 0
        return round(process.started_at.elapsed_seconds(process.ended_at) * MILLISECONDS)
