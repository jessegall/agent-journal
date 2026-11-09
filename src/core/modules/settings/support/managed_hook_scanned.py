from dataclasses import dataclass
from typing import ClassVar

from core.base.change.system_event import SystemEvent


@dataclass(frozen=True)
class ManagedHookScanned(SystemEvent):
    """The managed hooks were scanned."""

    name: ClassVar[str] = "managed-hook.scanned"
