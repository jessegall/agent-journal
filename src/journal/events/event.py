from dataclasses import dataclass


@dataclass(frozen=True, kw_only=True)
class Event:
    """Something that happened inside the journal, told on the bus to whoever listens."""
