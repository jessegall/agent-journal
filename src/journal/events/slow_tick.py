from dataclasses import dataclass

from journal.events.event import Event


@dataclass(frozen=True, kw_only=True)
class SlowTick(Event):
    """A job's tick that ran longer than the job runner allows, told once it has ended."""

    job: str
    seconds: float
