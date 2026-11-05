from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.change.logged_event import LoggedEvent
from core.base.listener.commit_listener import CommitListener
from core.base.query.queries import Queries
from core.base.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.agent_line import AgentLine
from suites.coding.modules.workers.support.worker_resume import WorkerResume
from core.base.change.created import Created


class EndedWorkerJobListener(CommitListener[Created[AgentLine]]):
    """A job or a merge clash for a worker whose session has ended resumes that session; a running worker
    reads the line at its next hook."""

    name = "workers.ended-worker-job"
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, resume: WorkerResume) -> None:
        self.queries, self.worker_resume = queries, resume

    def handle(self, event: Created[AgentLine], logged: LoggedEvent) -> None:
        line = event.row
        self.worker_resume.resume(self.queries.query(Agent).find(line.agent_id), Actor(logged.actor_id, ActorType.AGENT))
