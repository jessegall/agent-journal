from dataclasses import dataclass

from core.modules.agents.models.agent import Agent


@dataclass(frozen=True)
class ModelUse:
    """How much one model of one type of agent was used lately, and the agents of it that are kept."""

    agent_type: str
    model: str
    jobs: int
    agents: tuple[Agent, ...]

    def idle(self) -> tuple[Agent, ...]:
        return tuple(sorted((agent for agent in self.agents if agent.ended_at is not None), key=lambda agent: agent.ended_at.value))

    @property
    def job_agent_ratio(self) -> float:
        return len(self.agents) / max(self.jobs, 0.5)
