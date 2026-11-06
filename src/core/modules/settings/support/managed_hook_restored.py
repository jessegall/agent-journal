from dataclasses import dataclass
from typing import ClassVar


@dataclass(frozen=True)
class ManagedHookRestored:
    """The managed hooks were restored."""

    name: ClassVar[str] = "managed-hook.restored"
