from dataclasses import dataclass

from engine.event.domain_event import DomainEvent
from core.modules.agents.models.agent_session import STOP_CHANGE, AgentSession


@dataclass(frozen=True)
class AgentStopped(DomainEvent[AgentSession]):
    """A person or an agent stopped an agent: its current session ended for that reason."""

    change_name = STOP_CHANGE
