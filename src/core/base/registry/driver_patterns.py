from collections.abc import Sequence
from dataclasses import dataclass
from fnmatch import fnmatchcase


@dataclass(frozen=True)
class DriverPatterns:
    """Patterns on drivers' full names, such as coding.* or *.worker, and whether they cover a driver."""

    patterns: Sequence[str]

    def covers(self, driver: str) -> bool:
        return any(fnmatchcase(driver, pattern) for pattern in self.patterns)
