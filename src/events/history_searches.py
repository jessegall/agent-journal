"""What history searches recognises: the agent searched the journal's history, got the result, or opened something the result named."""

from dataclasses import dataclass

from events import Fact


@dataclass(frozen=True, kw_only=True)
class SearchMade(Fact):
    """The agent ran a command that searches or reads the history, so the chat marks it."""

    agent: int
    command: str


@dataclass(frozen=True, kw_only=True)
class SearchResultReturned(Fact):
    """A search command ended with this output."""

    agent: int
    command: str
    output: str


@dataclass(frozen=True, kw_only=True)
class SearchResultOpened(Fact):
    """The agent opened or read something while a search's result was open, so the mark keeps what it read."""

    agent: int
    key: str
    label: str
    text: str
