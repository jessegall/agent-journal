import time
from collections.abc import Sequence
from core.base.performance.performance_state import PerformanceState

TIMING_HEADER = "Journal-Timing"


class Timing:
    """The named wall clock stamps, in microseconds since 1970, one request collects in order on its way
    through the hook, the client and the server; a timing with no stamps belongs to no request, so it stays
    empty."""

    def __init__(self, stamps: Sequence[tuple[str, int]] = (), state: PerformanceState | None = None) -> None:
        self.stamps = list(stamps)
        self.state = state

    @classmethod
    def started(cls, name: str, state: PerformanceState | None = None) -> "Timing":
        if state is not None and not state.can_measure:
            return cls(state=state)
        return cls([(name, time.time_ns() // 1000)], state)

    @classmethod
    def parsed(cls, text: str) -> "Timing":
        pairs = (pair.partition("=") for pair in text.split(";") if pair)
        return cls([(name, int(value)) for name, _, value in pairs if name and value.isdigit()])

    def stamp(self, name: str) -> None:
        if self.stamps and (self.state is None or self.state.can_measure):
            self.stamps.append((name, time.time_ns() // 1000))

    def request_id(self, sender_pid: int) -> str:
        client_start = next((microseconds for name, microseconds in self.stamps if name == "go_start"), None)
        return "" if client_start is None else f"{sender_pid}-{client_start}"

    def joined(self, later: "Timing") -> "Timing":
        return Timing([*self.stamps, *later.stamps], self.state if self.state is not None else later.state)

    def text(self) -> str:
        return ";".join(f"{name}={microseconds}" for name, microseconds in self.stamps)
