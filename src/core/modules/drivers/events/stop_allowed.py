from dataclasses import dataclass

from engine.change.domain_event import DomainEvent
from core.modules.drivers.models.hook_call import STOP_ALLOWED, HookCall


@dataclass(frozen=True)
class StopAllowed(DomainEvent[HookCall]):
    """An agent stopped and the stop was allowed."""

    change_name = STOP_ALLOWED
