from engine.command.context import Context
from engine.command.handler import Handler
from engine.driver.message_sender import MessageSender
from engine.scope.actor_scope import ActorScope
from suites.coding.modules.workers.commands.wake_waiting_worker.wake_waiting_worker import WakeWaitingWorker
from suites.coding.modules.workers.support.work_units import WorkUnits
from suites.coding.modules.workers.support.worker_guidance import WorkerGuidance
from suites.coding.modules.workers.agent_messages.worker_unit_run_passed_message import WorkerUnitRunPassedMessage

WAKE_SOURCE = "workers.unit-run-passed"


class WakeWaitingWorkerHandler(Handler[WakeWaitingWorker, None]):
    """Tells a worker whose unit of several tasks is all committed that a run of its commit passed, with its next
    step; a worker still at work hears nothing."""

    command = WakeWaitingWorker
    disabled_scopes = [ActorScope]

    def __init__(self, units: WorkUnits, guidance: WorkerGuidance, message_sender: MessageSender) -> None:
        self.units, self.guidance, self.message_sender = units, guidance, message_sender

    def handle(self, command: WakeWaitingWorker, context: Context) -> None:
        unit = self.units.unit(command.worker_id)
        if not unit.is_committed_unit:
            return
        self.message_sender.send(command.worker_id, WorkerUnitRunPassedMessage.declared(), WAKE_SOURCE, context, phase=command.phase_id, line=self.guidance.line(command.worker_id))
