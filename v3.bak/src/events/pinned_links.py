"""What the pinned_links feature recognises: a link in the agent's words that no pin carries."""

from dataclasses import dataclass

from events import Fact


@dataclass(frozen=True, kw_only=True)
class LinkUnpinned(Fact):
    """A link the agent gave in the chat that no standing pin carries."""

    agent: int
    url: str
