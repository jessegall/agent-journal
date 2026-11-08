from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_stops import AgentStops
from suites.coding.modules.workers.support.worker_stop import WorkerStop
from suites.coding.support.coding_helper_kind import CodingHelperKind


class WorkerAgentStops(AgentStops):
    """A worker that ended comes back for a line unless someone stopped it on purpose."""

    def __init__(self, stops: WorkerStop) -> None:
        self.stops = stops

    def is_final(self, agent: Agent) -> bool:
        if agent.role != CodingHelperKind.WORKER or agent.ended_at is None:
            return super().is_final(agent)
        return self.stops.was_stopped(agent)
