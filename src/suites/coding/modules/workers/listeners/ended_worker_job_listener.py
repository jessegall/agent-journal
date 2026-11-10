from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.change.logged_event import LoggedEvent
from core.base.listener.commit_listener import CommitListener
from engine.scope.actor_scope import ActorScope
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.models.agent_line import AgentLine
from suites.coding.modules.workers.support.worker_resume import WorkerResume
from suites.coding.modules.workers.support.worker_job import RESUMING_SOURCES
from engine.change.created import Created


class EndedWorkerJobListener(CommitListener[Created[AgentLine]]):
    """A job or a merge clash for a worker whose session has ended resumes that session; a running worker
    reads the line at its next hook."""

    name = "workers.ended-worker-job"
    disabled_scopes = [ActorScope]

    def __init__(self, agents: AgentRows, resume: WorkerResume) -> None:
        self.agents, self.worker_resume = agents, resume

    def handle(self, event: Created[AgentLine], logged: LoggedEvent) -> None:
        line = event.row
        if line.source not in RESUMING_SOURCES:
            return
        self.worker_resume.resume(self.agents.find(line.session_agent_id), Actor(logged.actor_id, ActorType.AGENT))
