"""What the journal laws feature recognises: a law named by the words of a call or a turn, a whole read refused, a result larger than any before."""

from dataclasses import dataclass

from events import Fact


@dataclass(frozen=True, kw_only=True)
class LawMentioned(Fact):
    """A law whose keyword the agent used, to be repeated to it."""

    agent: int
    law: str
    text: str


@dataclass(frozen=True, kw_only=True)
class LongReadRefused(Fact):
    """A whole read of a long file that the law of narrow reading refused."""

    agent: int
    path: str
    count: int
    instead: str


@dataclass(frozen=True, kw_only=True)
class LargerResult(Fact):
    """A tool result larger than any the agent has had so far."""

    agent: int
    tool: str
    size: int
