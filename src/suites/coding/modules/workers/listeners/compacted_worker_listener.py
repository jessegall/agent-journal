from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.event.logged_event import LoggedEvent
from engine.listener.commit_listener import CommitListener
from engine.scope.actor_scope import ActorScope
from core.modules.agents.events.agent_ended import AgentEnded
from suites.coding.modules.workers.support.worker_compaction import WorkerCompaction
from suites.coding.modules.workers.support.worker_resume import WorkerResume


class CompactedWorkerListener(CommitListener[AgentEnded]):
    """A worker whose compaction run has ended goes on with the job that waits for it."""

    name = "workers.compacted-worker"
    disabled_scopes = [ActorScope]

    def __init__(self, resume: WorkerResume, compaction: WorkerCompaction) -> None:
        self.worker_resume, self.compaction = resume, compaction

    def handle(self, event: AgentEnded, logged: LoggedEvent) -> None:
        if self.compaction.finished(event.row.id):
            self.worker_resume.resume(event.row, Actor(logged.actor_id, ActorType.AGENT))
