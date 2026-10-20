from dataclasses import dataclass


@dataclass(frozen=True)
class BriefingStanding:
    """The briefing feature's reading: whether the agent has looked at what is in flight."""

    oriented: bool
