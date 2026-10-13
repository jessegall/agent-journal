"""What the hosting feature recognises: the state of a hosted ticket's app between two ticks of the clock."""

from dataclasses import dataclass

from events import Fact


@dataclass(frozen=True, kw_only=True)
class HostedAppAttended(Fact):
    """The agent that works the ticket is there again, so the app is no longer idle."""

    ticket: int


@dataclass(frozen=True, kw_only=True)
class HostedAppUnattended(Fact):
    """The ticket's agent is gone, so the app starts counting its idle time."""

    ticket: int


@dataclass(frozen=True, kw_only=True)
class HostedAppAbandoned(Fact):
    """The ticket's agent has been gone longer than the app may idle."""

    ticket: int
