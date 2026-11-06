from dataclasses import dataclass
from typing import ClassVar


@dataclass(frozen=True)
class ManagedHookScanned:
    """The managed hooks were scanned."""

    name: ClassVar[str] = "managed-hook.scanned"
