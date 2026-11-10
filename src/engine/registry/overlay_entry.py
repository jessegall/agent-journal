from collections.abc import Sequence
from dataclasses import dataclass

from engine.dotted_path.dotted_path import DottedPath
from engine.registry.driver_patterns import DriverPatterns


@dataclass(frozen=True)
class OverlayEntry:
    """A registered overlay as the registry lists it: its full name, the dotted path of its class, its place
    in the order, and the patterns of the drivers it applies to."""

    name: str
    path: DottedPath
    position: int
    drivers: Sequence[str]

    def covers(self, driver: str) -> bool:
        return DriverPatterns(self.drivers).covers(driver)
