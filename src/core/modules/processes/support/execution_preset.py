from collections.abc import Callable
from dataclasses import dataclass


@dataclass(frozen=True)
class ExecutionPreset:
    """One machine preset: each lane's capacity and the share of a lane one starter may hold, for a core count."""

    name: str
    instant: Callable[[int], int]
    short: Callable[[int], int]
    long: Callable[[int], int]
    starter_cap_percent: int

    def capacities(self, cores: int) -> tuple[int, int, int]:
        return self.instant(cores), self.short(cores), self.long(cores)
