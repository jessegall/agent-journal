"""What the agent profiles feature recognises: the settings that choose a profile's model changed."""

from dataclasses import dataclass

from events import Fact


@dataclass(frozen=True, kw_only=True)
class ProfilesChosen(Fact):
    """The models Settings picks for the researcher, planner and debugger profiles changed, so their files are out of date."""
