from dataclasses import dataclass, replace

LASTS = 900.0


@dataclass(frozen=True)
class UpdateHeld:
    """An update under way, as its mark says: the version it moves from and to, the step it is on, when it began and the process that runs it."""

    before: str
    to: str
    step: str
    time: float
    pid: int

    def at_step(self, step: str) -> "UpdateHeld":
        return replace(self, step=step)

    def is_stale(self, time: float) -> bool:
        return time - self.time > LASTS
