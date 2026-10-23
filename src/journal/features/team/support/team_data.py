from dataclasses import dataclass


@dataclass(frozen=True)
class TeamData:
    """The team feature's reading: the line asking for the journal's upgrade while the team is pinned to a newer version, empty otherwise."""

    upgrade: str
