from engine.actor.actor import Actor
from engine.change.created import Created
from engine.change.logged_event import LoggedEvent
from core.base.listener.commit_listener import CommitListener
from engine.query.queries import Queries
from engine.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.agent_line import AgentLine
from suites.coding.modules.workers.support.worker_job import SILENT_AGENT_SOURCE
from suites.coding.modules.workers.support.worker_resume import WorkerResume
from suites.coding.support.coding_helper_role import CodingHelperRole


class SilentWorkerLineListener(CommitListener[Created[AgentLine]]):
    """Resumes a headless worker for a silence recovery line through the shared session launcher."""

    name = "workers.silent-worker-line"
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, resume: WorkerResume) -> None:
        self.queries, self.worker_resume = queries, resume

    def handle(self, event: Created[AgentLine], logged: LoggedEvent) -> None:
        if event.row.source != SILENT_AGENT_SOURCE:
            return
        worker = self.queries.query(Agent).find(event.row.session_agent_id)
        if worker.role == CodingHelperRole.WORKER:
            self.worker_resume.restart(worker, event.row, Actor.core())
