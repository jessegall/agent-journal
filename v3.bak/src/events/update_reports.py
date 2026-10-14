"""What update reports recognises: a commit the journal has seen, and whether the agent may be reminded that it can write an update."""

from dataclasses import dataclass

from events import Fact


@dataclass(frozen=True, kw_only=True)
class CommitFirstSeen(Fact):
    """The first commit seen, which only sets the mark the offers are paced from."""

    commit: str


@dataclass(frozen=True, kw_only=True)
class OfferHeldBack(Fact):
    """A new commit while an offer was made lately or an update the user has not read waits: the mark follows the commit and the hour keeps running from `at`."""

    commit: str
    at: str


@dataclass(frozen=True, kw_only=True)
class UpdateOffered(Fact):
    """A new commit and nothing holds the offer: the agent is reminded it may write an update."""

    commit: str
