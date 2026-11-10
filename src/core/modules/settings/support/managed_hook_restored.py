from dataclasses import dataclass
from typing import ClassVar

from engine.change.system_event import SystemEvent


@dataclass(frozen=True)
class ManagedHookRestored(SystemEvent):
    """The managed hooks were restored."""

    name: ClassVar[str] = "managed-hook.restored"
