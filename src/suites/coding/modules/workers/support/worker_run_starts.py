from engine.command.bus import Bus
from engine.command.context import Context
from engine.driver.message_sender import MessageSender
from core.modules.plans.commands.fail_checkpoint.fail_checkpoint import FailCheckpoint
from core.modules.plans.models.checkpoint_reach import CheckpointReach
from suites.coding.modules.workers.support.merger_inbox import MergerInbox
from suites.coding.modules.workers.agent_messages.merger_worker_run_unstarted_message import MergerWorkerRunUnstartedMessage
from suites.coding.modules.workers.agent_messages.worker_run_unstarted_message import WorkerRunUnstartedMessage

UNSTARTED_SOURCE = "workers.worker-run-unstarted"


class WorkerRunStarts:
    """Ends a worker run whose checkout could not be made with no failed task, and tells the worker and the
    merger; the worker's next commit starts it again."""

    def __init__(self, bus: Bus, message_sender: MessageSender, inbox: MergerInbox) -> None:
        self.bus, self.message_sender, self.inbox = bus, message_sender, inbox

    def unstarted(self, reach: CheckpointReach, worker_id: int, context: Context) -> None:
        self.bus.dispatch(FailCheckpoint(reach.id), context)
        self.message_sender.send(worker_id, WorkerRunUnstartedMessage.declared(), UNSTARTED_SOURCE, context, phase=reach.phase_id)
        self.inbox.send_agent_message(MergerWorkerRunUnstartedMessage.declared().agent_message(phase=reach.phase_id, worker=worker_id), UNSTARTED_SOURCE, context)
