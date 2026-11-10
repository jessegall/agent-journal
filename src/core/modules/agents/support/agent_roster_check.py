from typing import TypeGuard

from engine.agent.agent_roster import AgentRoster
from core.modules.agents.models.agent import Agent


def is_agent_roster(value: object) -> TypeGuard[AgentRoster[Agent]]:
    return isinstance(value, AgentRoster)
