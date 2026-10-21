from dataclasses import dataclass, replace

UPDATE_PAUSE_SECONDS = 900.0


@dataclass(frozen=True)
class UpdatePause:
    """An update under way, as its mark says: the version it moves from and to, the step it is on, when it began and the process that runs it."""

    before: str
    to: str
    step: str
    time: float
    pid: int

    def at_step(self, step: str) -> "UpdatePause":
        return replace(self, step=step)

    def is_stale(self, time: float) -> bool:
        return time - self.time > UPDATE_PAUSE_SECONDS
