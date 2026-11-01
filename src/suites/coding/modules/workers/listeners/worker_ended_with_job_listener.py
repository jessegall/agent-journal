from core.base.agent_role import AgentRole
from core.base.change.logged_event import LoggedEvent
from core.base.listener.commit_listener import CommitListener
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from suites.coding.modules.workers.support.worker_resume import WorkerResume


class WorkerEndedWithJobListener(CommitListener):
    """A worker that ends with a job still waiting, sent after its last stop, resumes for that job."""

    name = "workers.worker-ended-with-job"
    event = "agent.update"

    def __init__(self, queries: Queries, resume: WorkerResume) -> None:
        self.queries, self.worker_resume = queries, resume

    def handle(self, event: LoggedEvent) -> None:
        worker = self.queries.query(Agent).find(event.row_id)
        if worker.role is AgentRole.WORKER and worker.ended_at is not None:
            self.worker_resume.resume(worker, event.actor_id)
