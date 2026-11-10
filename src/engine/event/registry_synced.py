from dataclasses import dataclass
from typing import ClassVar

from engine.event.event_log import REGISTRY_SYNC_EVENT
from engine.event.system_event import SystemEvent


@dataclass(frozen=True)
class RegistrySynced(SystemEvent):
    """The registry was written anew."""

    name: ClassVar[str] = REGISTRY_SYNC_EVENT
