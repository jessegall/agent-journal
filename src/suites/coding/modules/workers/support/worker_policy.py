from contextlib import AbstractContextManager

from engine.query.conditions.among import Among
from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.agents.models.enums.agent_session_state import AgentSessionState
from core.modules.agents.support.dispatch_policy import DispatchPolicy
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.models.enums.agent_line_state import AgentLineState
from suites.coding.models.enums.coding_helper_role import CodingHelperRole
from suites.coding.modules.workers.support.worker_job import RESUMING_SOURCES
from suites.coding.modules.workers.support.worker_sessions import WorkerSessions
from suites.coding.modules.workers.support.worker_stop import WorkerStop


class WorkerPolicy(DispatchPolicy):
    """What the coding suite decides about its workers: one start of a session at a time, and none before the
    session's last program has ended; a worker that ended should run again when a job waits for it that it
    may take, a worker that ended is gone for good only when someone stopped it on purpose, and a message
    always reaches a worker. Every other agent is answered as the default policy answers. It starts no
    program."""

    def __init__(self, sessions: WorkerSessions, worker_stop: WorkerStop, queries: Queries) -> None:
        self.sessions, self.worker_stop, self.queries = sessions, worker_stop, queries

    def lock(self, session: str) -> AbstractContextManager[bool]:
        return self.sessions.lock(session)

    def prepare(self, agent: Agent) -> AgentSessionState:
        return self.sessions.prepare(agent)

    def is_wanted(self, agent: Agent) -> bool:
        if not self.is_ended_worker(agent):
            return super().is_wanted(agent)
        waiting = self.queries.query(AgentLine).filter(session_agent_id=agent.id, state=AgentLineState.WAITING).matching(Among("source", tuple(RESUMING_SOURCES))).all_rows()
        jobs = tuple(waiting)
        return bool(jobs) and self.worker_stop.is_job_due(agent, jobs)

    def is_final(self, agent: Agent) -> bool:
        if not self.is_ended_worker(agent):
            return super().is_final(agent)
        return self.worker_stop.was_stopped(agent)

    def takes_messages(self, agent: Agent) -> bool:
        return agent.role == CodingHelperRole.WORKER or super().takes_messages(agent)

    @staticmethod
    def is_ended_worker(agent: Agent) -> bool:
        return agent.role == CodingHelperRole.WORKER and agent.ended_at is not None
