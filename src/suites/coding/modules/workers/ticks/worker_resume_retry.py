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
    refuses a worker while its program is open and nothing else asks once the program has ended. A job sent
    before a person or another agent stopped the worker stays waiting."""

    def __call__(self, container: Container) -> None:
        queries, resume = container.get(Queries), container.get(WorkerResume)
        waiting = list(queries.query(AgentLine).filter(state=AgentLineState.WAITING).matching(Among("source", tuple(RESUMING_SOURCES))).oldest().all_rows())
        for agent_id in dict.fromkeys(line.agent_id for line in waiting):
            worker = queries.query(Agent).find(agent_id)
            if self.may_resume(container, worker, [line for line in waiting if line.agent_id == agent_id]):
                resume.resume(worker, Actor.core())

    def may_resume(self, container: Container, worker: Agent, lines: list[AgentLine]) -> bool:
        ended_at = worker.ended_at
        if worker.role != AgentRole.WORKER or ended_at is None:
            return False
        if any(line.creation_timestamp().value > ended_at.value for line in lines):
            return True
        return not container.get(WorkerStop).was_stopped(worker)
