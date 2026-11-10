from core.modules.agents.events.agent_ended import AgentEnded
from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from suites.coding.models.enums.coding_helper_role import CodingHelperRole
from engine.event.logged_event import LoggedEvent
from engine.listener.commit_listener import CommitListener
from engine.query.queries import Queries
from engine.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import Agent
from suites.coding.modules.workers.support.worker_resume import WorkerResume
from suites.coding.modules.workers.support.worker_stop import WorkerStop
from engine.event.updated import Updated


class WorkerJobResumeListener(CommitListener[AgentEnded | Updated[Agent]]):
    """A worker that ends with a job still waiting, sent after its last stop, resumes for that job; one a
    person or another agent stopped stays ended, with its job waiting. Recording the process of a start is no
    reason to start again."""

    name = "workers.worker-ended-with-job"
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, resume: WorkerResume, stop: WorkerStop) -> None:
        self.queries, self.worker_resume, self.stop = queries, resume, stop

    def handle(self, event: AgentEnded | Updated[Agent], logged: LoggedEvent) -> None:
        worker = event.row
        if isinstance(event, Updated) and event.old_row is not None and event.old_row.pid != worker.pid:
            return
        ended_worker = worker.role == CodingHelperRole.WORKER and worker.ended_at is not None
        if ended_worker and not self.stop.is_final(worker, logged.actor_id):
            self.worker_resume.resume(worker, Actor(logged.actor_id, ActorType.AGENT))
