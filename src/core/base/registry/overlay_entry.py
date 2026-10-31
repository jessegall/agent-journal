from collections.abc import Sequence
from dataclasses import dataclass
from fnmatch import fnmatchcase

from core.base.registry.dotted_path import DottedPath


@dataclass(frozen=True)
class OverlayEntry:
    """A registered overlay as the registry lists it: its full name, the dotted path of its class, its place in the
    order, and the patterns of the drivers it applies to."""

    name: str
    path: DottedPath
    position: int
    drivers: Sequence[str]

    def covers(self, driver: str) -> bool:
        return any(fnmatchcase(driver, pattern) for pattern in self.drivers)
