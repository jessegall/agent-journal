from dataclasses import dataclass


@dataclass(frozen=True)
class ProfileSkill:
    """One skill as a profile lists it: listed when its agents get it, matches_type when it is made for the profile's agent
    type."""

    folder: str
    description: str
    listed: bool
    matches_type: bool
