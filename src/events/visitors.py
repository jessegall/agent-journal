"""What the sharing feature recognises: a visitor's comment that reached the agent or the journal."""

from dataclasses import dataclass

from events import Fact


@dataclass(frozen=True, kw_only=True)
class VisitorCommentRead(Fact):
    """A command showed the agent visitors' comments, which hold its tools until it agrees not to act on them."""

    agent: int
    comments: tuple[int, ...]


@dataclass(frozen=True, kw_only=True)
class VisitorCommented(Fact):
    """A visitor left a comment on a shared page."""

    agent: int
    comment: int
    name: str
    about: str


@dataclass(frozen=True, kw_only=True)
class TrustedVisitorCommented(VisitorCommented):
    """A visitor the user trusts left a comment on a shared page."""
