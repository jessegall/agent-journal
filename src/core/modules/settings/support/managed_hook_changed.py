from dataclasses import dataclass
from typing import ClassVar

from core.base.change.system_event import SystemEvent


@dataclass(frozen=True)
class ManagedHookChanged(SystemEvent):
    """A managed hook was set."""

    name: ClassVar[str] = "managed-hook.changed"
