from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.agents.models.agent import Agent
from core.modules.drivers.support.suite_choice import SuiteChoice
from suites.coding.modules.workers.commands.end_inactive_worker.end_inactive_worker import EndInactiveWorker


class EndInactiveWorkerHandler(Handler[EndInactiveWorker, Agent]):
    """Ends an idle worker's row and leaves its tasks, its worktree and its session as they are."""

    command = EndInactiveWorker

    def __init__(self, queries: Queries, repository: Repository, suites: SuiteChoice) -> None:
        self.queries, self.repository, self.suites = queries, repository, suites

    def handle(self, command: EndInactiveWorker, context: Context) -> Agent:
        worker = self.queries.query(Agent).find(command.worker_id)
        return worker if worker.ended_at is not None else self.repository.save(worker.ended(context.timestamp, self.suites.agent_policy()), context)
