from core.base.actor import Actor
from core.base.change.created import Created
from core.base.change.logged_event import LoggedEvent
from core.base.listener.commit_listener import CommitListener
from core.base.query.queries import Queries
from core.base.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.agent_line import AgentLine
from suites.coding.modules.workers.support.worker_job import SILENT_AGENT_SOURCE
from suites.coding.modules.workers.support.worker_resume import WorkerResume
from suites.coding.support.coding_helper_kind import CodingHelperKind


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
        if worker.role == CodingHelperKind.WORKER:
            self.worker_resume.restart(worker, event.row, Actor.core())
