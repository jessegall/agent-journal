from collections.abc import Iterable
from dataclasses import dataclass

from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_label import AgentLabel

PERSON_RETIRES_TEXT = "ask the user to retire one"


@dataclass(frozen=True)
class TypeLimits:
    """The running and retained limits for one agent type."""

    run: int
    kept: int

    @staticmethod
    def kept_limit_suggestion(agents: Iterable[Agent]) -> str:
        idle_agents = sorted((agent for agent in agents if agent.ended_at is not None), key=lambda agent: agent.number)
        if not idle_agents:
            return f"wait for a report, or {PERSON_RETIRES_TEXT}"
        return f"send the job to idle {AgentLabel.labelled(idle_agents[0]).text}, or {PERSON_RETIRES_TEXT}"
