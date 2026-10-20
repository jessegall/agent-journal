from dataclasses import dataclass, replace

LASTS = 900.0
"""Seconds an update may hold its mark before it is taken for one that died: the install's own limit and the restart after it."""


@dataclass(frozen=True)
class UpdateHeld:
    """An update under way, as its mark says: the version it moves from and to, the step it is on, when it began and the process that runs it."""

    before: str
    to: str
    step: str
    at: float
    pid: int

    def at_step(self, step: str) -> "UpdateHeld":
        return replace(self, step=step)

    def is_stale(self, now: float) -> bool:
        return now - self.at > LASTS
