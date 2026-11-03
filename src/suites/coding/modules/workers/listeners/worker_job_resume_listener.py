from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.agent_role import AgentRole
from core.base.change.logged_event import LoggedEvent
from core.base.listener.commit_listener import CommitListener
from core.base.query.queries import Queries
from core.modules.actors.models.actor_record import ActorRecord
from core.modules.agents.models.agent import Agent
from suites.coding.modules.workers.support.worker_resume import WorkerResume


class WorkerJobResumeListener(CommitListener):
    """A worker that ends with a job still waiting, sent after its last stop, resumes for that job; one a
    person ended stays ended, with its job waiting."""

    name = "workers.worker-ended-with-job"
    event = "agent.update"

    def __init__(self, queries: Queries, resume: WorkerResume) -> None:
        self.queries, self.worker_resume = queries, resume

    def handle(self, event: LoggedEvent) -> None:
        worker = self.queries.query(Agent).find(event.row_id)
        ended_worker = worker.role is AgentRole.WORKER and worker.ended_at is not None
        if ended_worker and self.queries.query(ActorRecord).find(event.actor_id).type is not ActorType.USER:
            self.worker_resume.resume(worker, Actor(event.actor_id, ActorType.AGENT))
