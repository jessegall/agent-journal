from dataclasses import dataclass
from typing import ClassVar


@dataclass(frozen=True)
class ManagedHookChanged:
    """A managed hook was set."""

    name: ClassVar[str] = "managed-hook.changed"
