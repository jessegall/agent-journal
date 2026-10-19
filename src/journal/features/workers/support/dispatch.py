from dataclasses import dataclass, replace

CURRENT_SECONDS = 60.0


@dataclass(frozen=True)
class Dispatch:
    """One subagent the agent dispatched: what it was asked, of which type and model, its own session once known, and how it stands."""

    id: str
    at: float
    task: str
    brief: str
    type: str
    model: str
    session: str = ""
    status: str = "running"
    running: bool = True
    ended: float = 0.0

    def is_current(self, now: float) -> bool:
        """Still out, or ended within the last minute: a dispatch the chat's mark can still be waiting on; an older one is history."""
        return self.running or now - self.ended < CURRENT_SECONDS

    def answered(self, session: str) -> "Dispatch":
        return replace(self, session=session)

    def settled(self, status: str, at: float) -> "Dispatch":
        return replace(self, status=status, running=False, ended=at)
