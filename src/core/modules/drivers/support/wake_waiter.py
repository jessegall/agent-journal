from dataclasses import dataclass

from core.modules.drivers.models.enums.wake_outcome import WakeOutcome


@dataclass
class WakeWaiter:
    """One agent program's wake hook waiting on the server for a line, named by the token it sent; WakeWaiters
    changes it under its lock when a line is given to it or it is cancelled."""

    agent_id: int
    token: str
    outcome: WakeOutcome = WakeOutcome.NOTHING
    text: str = ""
    line_id: int = 0

    @property
    def is_live(self) -> bool:
        return self.outcome is WakeOutcome.NOTHING
