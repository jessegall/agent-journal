from engine.command.context import Context
from engine.command.handler import Handler
from engine.driver.nudger import Nudger
from engine.scope.actor_scope import ActorScope
from suites.coding.modules.workers.commands.wake_waiting_worker.wake_waiting_worker import WakeWaitingWorker
from suites.coding.modules.workers.support.work_units import WorkUnits
from suites.coding.modules.workers.support.worker_guidance import WorkerGuidance
from suites.coding.modules.workers.support.worker_nudges import WORKER_UNIT_RUN_PASSED

WAKE_SOURCE = "workers.unit-run-passed"


class WakeWaitingWorkerHandler(Handler[WakeWaitingWorker, None]):
    """Tells a worker whose unit of several tasks is all committed that a run of its commit passed, with its next
    step; a worker still at work hears nothing."""

    command = WakeWaitingWorker
    disabled_scopes = [ActorScope]

    def __init__(self, units: WorkUnits, guidance: WorkerGuidance, nudger: Nudger) -> None:
        self.units, self.guidance, self.nudger = units, guidance, nudger

    def handle(self, command: WakeWaitingWorker, context: Context) -> None:
        unit = self.units.unit(command.worker_id)
        if not (unit.has_several_tasks and unit.is_committed):
            return
        self.nudger.send(command.worker_id, WORKER_UNIT_RUN_PASSED, WAKE_SOURCE, context, phase=command.phase_id, commit=command.commit_id, line=self.guidance.line(command.worker_id))
