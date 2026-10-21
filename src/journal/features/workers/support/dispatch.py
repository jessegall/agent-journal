from dataclasses import dataclass, replace

CURRENT_SECONDS = 60.0


@dataclass(frozen=True)
class Dispatch:
    """One subagent the agent dispatched: what it was asked, of which type and model, its own session once known, and how it stands."""

    id: str
    time: float
    task: str
    brief: str
    type: str
    model: str
    session: str = ""
    status: str = "running"
    running: bool = True
    ended: float = 0.0

    def is_current(self, time: float) -> bool:
        return self.running or time - self.ended < CURRENT_SECONDS

    def answered(self, session: str) -> "Dispatch":
        return replace(self, session=session)

    def settled(self, status: str, time: float) -> "Dispatch":
        return replace(self, status=status, running=False, ended=time)
