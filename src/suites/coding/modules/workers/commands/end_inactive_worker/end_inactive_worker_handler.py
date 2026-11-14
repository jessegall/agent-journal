from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_dispatcher import AgentDispatcher
from suites.coding.modules.workers.commands.end_inactive_worker.end_inactive_worker import EndInactiveWorker


class EndInactiveWorkerHandler(Handler[EndInactiveWorker, Agent]):
    """Has the dispatcher end an idle worker's row and leaves its tasks, its worktree and its session as they
    are."""

    command = EndInactiveWorker

    def __init__(self, queries: Queries, dispatcher: AgentDispatcher) -> None:
        self.queries, self.dispatcher = queries, dispatcher

    def handle(self, command: EndInactiveWorker, context: Context) -> Agent:
        worker = self.queries.query(Agent).find(command.worker_id)
        return worker if worker.ended_at is not None else self.dispatcher.end_row(worker, context)
