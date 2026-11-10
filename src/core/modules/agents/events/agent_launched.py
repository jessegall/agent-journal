from dataclasses import dataclass

from engine.event.domain_event import DomainEvent
from core.modules.agents.models.agent import LAUNCH_CHANGE, Agent


@dataclass(frozen=True)
class AgentLaunched(DomainEvent[Agent]):
    """The launcher started an agent's program."""

    change_name = LAUNCH_CHANGE
