from dataclasses import dataclass
from typing import ClassVar

from core.base.change.event_log import UPGRADE_MOVED_EVENT


@dataclass(frozen=True)
class UpgradeMoved:
    """A module's rows of the older version were moved."""

    name: ClassVar[str] = UPGRADE_MOVED_EVENT
