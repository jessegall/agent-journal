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
        ended = [(agent.ended_at, agent) for agent in self.agents if agent.ended_at is not None]
        return tuple(agent for _, agent in sorted(ended, key=lambda pair: pair[0].value))
