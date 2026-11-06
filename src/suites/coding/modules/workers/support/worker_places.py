from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_type_limits import AgentTypeLimits
from suites.coding.support.coding_agent_role import CodingAgentRole
from core.modules.agents.support.agent_rows import AgentRows


class WorkerPlaces:
    """How many workers run against the run limit. A run place is a process that has not ended: delivered work with
    its process stopped takes no run place."""

    def __init__(self, agents: AgentRows, limits: AgentTypeLimits) -> None:
        self.agents, self.limits = agents, limits

    def running(self) -> tuple[Agent, ...]:
        return self.agents.running(CodingAgentRole.WORKER)

    def run_limit(self) -> int:
        return self.limits.of(CodingAgentRole.WORKER).run

    def has_free_place(self) -> bool:
        return len(self.running()) < self.run_limit()
