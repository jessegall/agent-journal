from dataclasses import dataclass

from core.modules.agents.models.agent import Agent


@dataclass(frozen=True)
class ModelUse:
    """How much one model of one type of agent was used lately, and the agents of it that are kept."""

    agent_type: str
    model: str
    jobs: int
    kept: tuple[Agent, ...]

    def idle(self) -> tuple[Agent, ...]:
        return tuple(sorted((agent for agent in self.kept if agent.ended_at is not None), key=lambda agent: agent.ended_at.value))

    @property
    def spare_share(self) -> float:
        return len(self.kept) / max(self.jobs, 0.5)
