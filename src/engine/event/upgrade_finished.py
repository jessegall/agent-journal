from dataclasses import dataclass
from typing import ClassVar

from engine.event.event_log import UPGRADE_FINISHED_EVENT
from engine.event.system_event import SystemEvent


@dataclass(frozen=True)
class UpgradeFinished(SystemEvent):
    """An upgrade from version 4 has ended."""

    name: ClassVar[str] = UPGRADE_FINISHED_EVENT
