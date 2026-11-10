from dataclasses import dataclass

from engine.event.domain_event import DomainEvent
from core.modules.drivers.models.hook_call import SESSION_START, HookCall


@dataclass(frozen=True)
class SessionStarted(DomainEvent[HookCall]):
    """An agent session started."""

    change_name = SESSION_START
