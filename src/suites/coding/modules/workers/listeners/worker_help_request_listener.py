from suites.coding.support.coding_helper_kind import CodingHelperKind
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.base.query.queries import Queries
from core.base.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import Agent
from core.modules.drivers.support.nudger import Nudger
from core.modules.waits.models.enums.wait_type import WaitType
from core.modules.waits.models.wait import Wait
from suites.coding.modules.workers.support.worker_nudges import WORKER_HELP_REQUEST
from suites.coding.modules.workers.support.worker_unfinished_tasks import WorkerUnfinishedTasks
from core.base.change.created import Created
from core.base.command.context import Context

SOURCE = "workers.help-request"


class WorkerHelpRequestListener(SaveListener[Created[Wait]]):
    """A worker that says it is stuck tells its main agent at once, with the reason and the tasks it has left,
    unless a run of its own still goes, which is waiting and not being stuck."""

    name = "workers.help-request"
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, nudger: Nudger, unfinished: WorkerUnfinishedTasks) -> None:
        self.queries, self.nudger, self.unfinished = queries, nudger, unfinished

    def handle(self, event: Created[Wait], context: Context) -> None:
        wait = event.row
        if wait.type is not WaitType.HELP_REQUEST:
            return
        worker = self.queries.query(Agent).find(wait.session_agent_id)
        should_notify = worker.role == CodingHelperKind.WORKER and worker.parent_id is not None and not self.unfinished.has_running_process(worker.id)
        if should_notify:
            self.nudger.send(worker.parent_id, WORKER_HELP_REQUEST, SOURCE, context, worker=worker.id, tasks=self.unfinished.names(self.unfinished.rows(worker.id)), wait=wait.id)
