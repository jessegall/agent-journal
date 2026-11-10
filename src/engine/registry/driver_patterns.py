from collections.abc import Sequence
from dataclasses import dataclass
from fnmatch import fnmatchcase


@dataclass(frozen=True)
class DriverPatterns:
    """Patterns on driver names, such as notes.* or *.reader, and whether they cover a driver."""

    patterns: Sequence[str]

    def covers(self, driver: str) -> bool:
        return any(fnmatchcase(driver, pattern) for pattern in self.patterns)
