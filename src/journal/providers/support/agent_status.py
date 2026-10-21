from dataclasses import dataclass

from journal.providers.support.rate_window import RateWindow


@dataclass(frozen=True)
class AgentStatus:
    """What the program last reported about a session: its model, its reasoning effort, how full its context is and its plan's windows; a part it never reported is empty, its context None, never zero."""

    model: str
    effort: str
    context: float | None
    windows: tuple[RateWindow, ...]
