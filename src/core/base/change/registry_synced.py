from dataclasses import dataclass
from typing import ClassVar

from core.base.change.event_log import REGISTRY_SYNC_EVENT


@dataclass(frozen=True)
class RegistrySynced:
    """The registry was written anew."""

    name: ClassVar[str] = REGISTRY_SYNC_EVENT
