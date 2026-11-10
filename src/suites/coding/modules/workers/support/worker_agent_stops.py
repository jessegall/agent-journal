from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_stops import AgentStops
from suites.coding.modules.workers.support.worker_stop import WorkerStop
from suites.coding.models.enums.coding_helper_role import CodingHelperRole


class WorkerAgentStops(AgentStops):
    """A worker that ended comes back for a line unless someone stopped it on purpose; a message always reaches it."""

    def __init__(self, stops: WorkerStop) -> None:
        self.stops = stops

    def is_final(self, agent: Agent) -> bool:
        if agent.role != CodingHelperRole.WORKER or agent.ended_at is None:
            return super().is_final(agent)
        return self.stops.was_stopped(agent)

    def takes_messages(self, agent: Agent) -> bool:
        return agent.role == CodingHelperRole.WORKER or super().takes_messages(agent)
