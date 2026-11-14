from enum import StrEnum

from core.modules.agents.models.enums.dispatch import Dispatch


class LaunchAnswer(StrEnum):
    """What the launcher did with an agent's program: started it, found one of its programs still open, or did
    not start it. Locked down means the program is at a usage limit: nothing was asked of the launcher and
    nothing failed, so the caller tries again later."""

    STARTED = "started"
    RUNNING = "running"
    FAILED = "failed"
    LOCKED = "locked"
    SKIPPED = "skipped"
    LOCKED_DOWN = "locked_down"

    @property
    def dispatch(self) -> Dispatch:
        return DISPATCHES[self]


DISPATCHES = {
    LaunchAnswer.STARTED: Dispatch.STARTED,
    LaunchAnswer.RUNNING: Dispatch.RUNNING,
    LaunchAnswer.LOCKED: Dispatch.LOCKED,
    LaunchAnswer.FAILED: Dispatch.FAILED,
    LaunchAnswer.SKIPPED: Dispatch.REFUSED,
    LaunchAnswer.LOCKED_DOWN: Dispatch.REFUSED,
}
