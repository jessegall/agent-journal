from dataclasses import dataclass

from journal.events.event import Event


@dataclass(frozen=True, kw_only=True)
class ClockTicked(Event):
    """The clock, every interval, once for the whole journal: for what runs on a schedule of its own."""

    at: float
