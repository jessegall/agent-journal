from dataclasses import dataclass
from typing import ClassVar

from engine.change.event_log import UPGRADE_MOVED_EVENT
from engine.change.system_event import SystemEvent


@dataclass(frozen=True)
class UpgradeMoved(SystemEvent):
    """A module's rows of the older version were moved."""

    name: ClassVar[str] = UPGRADE_MOVED_EVENT
