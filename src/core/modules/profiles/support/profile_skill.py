from dataclasses import dataclass


@dataclass(frozen=True)
class ProfileSkill:
    """One skill as a profile lists it: listed when its agents get it, matching the type when it is made for the
    profile's agent type, required when the profile's agents must read it at the start, and locked when every
    agent reads it at the start, so that a profile cannot switch it off."""

    folder: str
    description: str
    listed: bool
    matches_type: bool
    required: bool
    locked: bool

    @property
    def status(self) -> str:
        if self.required:
            return "on, required"
        return "on" if self.listed else "off"
