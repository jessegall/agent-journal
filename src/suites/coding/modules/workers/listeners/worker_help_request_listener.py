from suites.coding.support.coding_helper_role import CodingHelperRole
from core.base.listener.save_listener import SaveListener
from engine.query.queries import Queries
from engine.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import Agent
from core.modules.waits.models.enums.wait_type import WaitType
from core.modules.waits.models.wait import Wait
from suites.coding.modules.workers.support.merger_inbox import MergerInbox
from suites.coding.modules.workers.support.worker_nudges import WORKER_HELP_REQUEST
from suites.coding.modules.workers.support.worker_unfinished_tasks import WorkerUnfinishedTasks
from engine.change.created import Created
from engine.command.context import Context

SOURCE = "workers.help-request"


class WorkerHelpRequestListener(SaveListener[Created[Wait]]):
    """A worker that says it is stuck tells the merger at once, or its main agent with the merger off, with
    the reason and the tasks it has left, unless a run of its own still goes, which is waiting and not stuck."""

    name = "workers.help-request"
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, inbox: MergerInbox, unfinished: WorkerUnfinishedTasks) -> None:
        self.queries, self.inbox, self.unfinished = queries, inbox, unfinished

    def handle(self, event: Created[Wait], context: Context) -> None:
        wait = event.row
        if wait.type is not WaitType.HELP_REQUEST:
            return
        worker = self.queries.query(Agent).find(wait.session_agent_id)
        should_notify = worker.role == CodingHelperRole.WORKER and worker.parent_id is not None and not self.unfinished.has_running_process(worker.id)
        if should_notify:
            self.inbox.send_nudge(WORKER_HELP_REQUEST.nudge(worker=worker.id, tasks=self.unfinished.names(self.unfinished.rows(worker.id)), wait=wait.id), SOURCE, context)
