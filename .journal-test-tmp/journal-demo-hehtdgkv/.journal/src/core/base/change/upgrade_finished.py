from dataclasses import dataclass
from typing import ClassVar

from core.base.change.event_log import UPGRADE_FINISHED_EVENT


@dataclass(frozen=True)
class UpgradeFinished:
    """An upgrade from version 4 has ended."""

    name: ClassVar[str] = UPGRADE_FINISHED_EVENT
