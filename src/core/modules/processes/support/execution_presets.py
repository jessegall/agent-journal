import os
from collections.abc import Callable
from dataclasses import dataclass

from engine.errors.refusal import Refusal


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


# the one table of presets; medium on 8 cores gives the defaults of doc 1266 (instant 24, short 12, long 8)
PRESETS = (
    ExecutionPreset("small", lambda cores: 2 * cores, lambda cores: cores, lambda cores: max(4, cores // 2), 50),
    ExecutionPreset("medium", lambda cores: 3 * cores, lambda cores: cores * 3 // 2, lambda cores: cores, 50),
    ExecutionPreset("large", lambda cores: 4 * cores, lambda cores: 2 * cores, lambda cores: 2 * cores, 50),
)


class ExecutionPresets:
    """The machine presets, read for this machine's core count."""

    def __init__(self, core_count: Callable[[], int] = lambda: os.cpu_count() or 1) -> None:
        self.core_count = core_count

    def preset(self, name: str) -> ExecutionPreset:
        chosen = next((preset for preset in PRESETS if preset.name == name), None)
        if chosen is None:
            raise Refusal(f"{name} is no preset", f"name one of {', '.join(preset.name for preset in PRESETS)}")
        return chosen

    def lines(self) -> list[str]:
        cores = self.core_count()
        return [f"{preset.name}: instant {instant}, short {short}, long {long} slot units on {cores} cores"
                for preset in PRESETS for instant, short, long in [preset.capacities(cores)]]
