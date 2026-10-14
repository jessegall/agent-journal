"""What the status bar recognises in an agent's reports: that its bar, its line of what it does, or its usage has changed."""

from dataclasses import dataclass

from events import Fact


@dataclass(frozen=True, kw_only=True)
class BarStale(Fact):
    """An agent reported, so the bar may no longer show what it does."""

    agent: int


@dataclass(frozen=True, kw_only=True)
class DoingStale(Fact):
    """An agent reported, so its own line of what it does may be out of date."""

    agent: int


@dataclass(frozen=True, kw_only=True)
class UsageRead(Fact):
    """The agent's transcript shows usage its row does not hold yet."""

    agent: int
    usage: dict
