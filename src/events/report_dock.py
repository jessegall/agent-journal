"""What the report dock recognises: a report the agent wrote that should sit above the chat, and one the user has dealt with."""

from dataclasses import dataclass

from events import Fact


@dataclass(frozen=True, kw_only=True)
class ReportDocked(Fact):
    """The agent wrote or finished report n, so it sits above the chat until the user deals with it."""

    n: int


@dataclass(frozen=True, kw_only=True)
class ReportUndocked(Fact):
    """The user opened report n, pressed one of its buttons or put it away, or it was closed, so it leaves the chat."""

    n: int
