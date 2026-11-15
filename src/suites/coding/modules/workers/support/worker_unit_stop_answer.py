from dataclasses import dataclass

from engine.driver.nudge import Nudge


@dataclass(frozen=True)
class WorkerUnitStopAnswer:
    """What holds a worker's stop now, if anything, and the lines of its blocked tasks when it has none left."""

    refusal: str | None
    blocked_lines: tuple[Nudge, ...]
