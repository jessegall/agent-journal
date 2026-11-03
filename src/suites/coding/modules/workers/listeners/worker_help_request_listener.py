from core.base.agent_role import AgentRole
from core.base.change.change import Change
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

SOURCE = "workers.help-request"


class WorkerHelpRequestListener(SaveListener):
    """A worker that says it is stuck tells its main agent at once, with the reason and the tasks it has left."""

    name = "workers.help-request"
    event = "wait.create"
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, nudger: Nudger, unfinished: WorkerUnfinishedTasks) -> None:
        self.queries, self.nudger, self.unfinished = queries, nudger, unfinished

    def handle(self, change: Change[Model]) -> None:
        wait = change.new_row
        if not isinstance(wait, Wait) or wait.type is not WaitType.HELP_REQUEST:
            return
        worker = self.queries.query(Agent).find(wait.agent_id)
        if worker.role is AgentRole.WORKER and worker.parent_id is not None:
            self.nudger.send(worker.parent_id, WORKER_HELP_REQUEST, SOURCE, change.context, worker=worker.id, tasks=self.unfinished.names(self.unfinished.rows(worker.id)), wait=wait.id)
