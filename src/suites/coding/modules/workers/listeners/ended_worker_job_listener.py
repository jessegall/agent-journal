from core.base.change.logged_event import LoggedEvent
from core.base.listener.commit_listener import CommitListener
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.agent_line import AgentLine
from suites.coding.modules.workers.support.worker_resume import WorkerResume


class EndedWorkerJobListener(CommitListener):
    """A job or a merge clash for a worker whose session has ended resumes that session; a running worker reads the
    line at its next hook."""

    name = "workers.ended-worker-job"
    event = "agent_line.create"

    def __init__(self, queries: Queries, resume: WorkerResume) -> None:
        self.queries, self.worker_resume = queries, resume

    def handle(self, event: LoggedEvent) -> None:
        line = self.queries.query(AgentLine).find(event.row_id)
        self.worker_resume.resume(self.queries.query(Agent).find(line.agent_id), event.actor_id)
