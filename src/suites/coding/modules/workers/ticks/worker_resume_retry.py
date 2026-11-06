from core.base.connection_probe import ConnectionProbe
from core.base.internet_connection import InternetConnection
from core.base.journal_home import JournalHome
from core.base.clock import Clock
from core.base.actor import Actor
from suites.coding.support.coding_agent_role import CodingAgentRole as AgentRole
from core.base.container import Container
from core.base.query.conditions.among import Among
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.models.enums.agent_line_state import AgentLineState
from suites.coding.modules.workers.support.worker_job import RESUMING_SOURCES
from suites.coding.modules.workers.support.worker_resume import WorkerResume
from suites.coding.modules.workers.support.worker_stop import WorkerStop


class WorkerResumeRetry:
    """Every few seconds, each ended worker with a job still waiting is resumed again, since the launcher
    refuses a worker while its program is open and nothing else asks once the program has ended. A program still
    open under an ended row is stopped, on this tick's own thread. A job sent before a person or another agent
    stopped the worker stays waiting."""

    def __call__(self, container: Container) -> None:
        InternetConnection.shared(container.get(JournalHome)).check(container.get(ConnectionProbe), container.get(Clock).timestamp())
        queries, resume = container.get(Queries), container.get(WorkerResume)
        waiting = list(queries.query(AgentLine).filter(state=AgentLineState.WAITING).matching(Among("source", tuple(RESUMING_SOURCES))).oldest().all_rows())
        for worker in queries.query(Agent).find_many(list(dict.fromkeys(line.session_agent_id for line in waiting))):
            if self.may_resume(container, worker, [line for line in waiting if line.session_agent_id == worker.id]):
                resume.resume_or_stop_held(worker, Actor.core())

    def may_resume(self, container: Container, worker: Agent, lines: list[AgentLine]) -> bool:
        return worker.role == AgentRole.WORKER and worker.ended_at is not None and container.get(WorkerStop).is_job_due(worker, lines)
