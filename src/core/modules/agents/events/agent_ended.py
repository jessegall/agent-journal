from dataclasses import dataclass

from engine.event.domain_event import DomainEvent
from engine.model.model import END_CHANGE
from core.modules.agents.models.agent import Agent


@dataclass(frozen=True)
class AgentEnded(DomainEvent[Agent]):
    """An agent session ended."""

    change_name = END_CHANGE
