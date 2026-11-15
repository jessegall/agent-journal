from engine.command.bus import Bus
from engine.command.context import Context
from engine.driver.message_sender import MessageSender
from engine.errors.refusal import Refusal
from engine.query.queries import Queries
from core.modules.plans.commands.fail_checkpoint.fail_checkpoint import FailCheckpoint
from core.modules.plans.models.checkpoint_reach import CheckpointReach
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.checkpoint_folders import CheckpointFolders
from suites.coding.modules.workers.support.merger_inbox import MergerInbox
from suites.coding.modules.workers.agent_messages.merger_worker_run_unstarted_message import MergerWorkerRunUnstartedMessage
from suites.coding.modules.workers.agent_messages.worker_run_unstarted_message import WorkerRunUnstartedMessage

UNSTARTED_SOURCE = "workers.worker-run-unstarted"


class WorkerRunStarts:
    """Makes the checkout of a checkpoint run. When the checkout of a worker run cannot be made, the run ends
    with no failed task, and the worker and the merger are told; the worker's next commit starts it again."""

    def __init__(self, folders: CheckpointFolders, queries: Queries, bus: Bus, message_sender: MessageSender, inbox: MergerInbox) -> None:
        self.folders, self.queries, self.bus, self.message_sender, self.inbox = folders, queries, bus, message_sender, inbox

    def checkout(self, reach: CheckpointReach, context: Context) -> str | None:
        link = self.folders.link(reach)
        if link is None:
            return self.folders.checkout(reach)
        try:
            return self.folders.checkout(reach)
        except Refusal:
            worker_id = self.queries.query(Worktree).find(link.worktree_id).session_agent_id
            self.bus.dispatch(FailCheckpoint(reach.id), context)
            self.message_sender.send(worker_id, WorkerRunUnstartedMessage.declared(), UNSTARTED_SOURCE, context, phase=reach.phase_id)
            self.inbox.send_agent_message(MergerWorkerRunUnstartedMessage.declared().agent_message(phase=reach.phase_id, worker=worker_id), UNSTARTED_SOURCE, context)
            return None
