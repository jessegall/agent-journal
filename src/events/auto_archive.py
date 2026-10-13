"""What the auto-archive feature recognises: that its trigger says it is time."""

from dataclasses import dataclass

from events import Fact


@dataclass(frozen=True, kw_only=True)
class OldRowsDue(Fact):
    """The auto-archive trigger says it is time to age out and pack old rows."""

    agent: int
