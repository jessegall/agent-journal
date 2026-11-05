from dataclasses import dataclass

from core.base.change.domain_event import DomainEvent
from core.modules.drivers.models.hook_call import STOP_REFUSED, HookCall


@dataclass(frozen=True)
class StopDenied(DomainEvent[HookCall]):
    """An agent tried to stop and the stop was refused."""

    change_name = STOP_REFUSED
