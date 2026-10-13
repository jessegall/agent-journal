"""What the integrations recognise: an answer the user approved to be sent on, and a ticket whose stage moved."""

from dataclasses import dataclass

from events import Fact


@dataclass(frozen=True, kw_only=True)
class ReplyApproved(Fact):
    """The user pressed Send on a proposed answer to a ticket from an outside service, and the text is to go out as it was shown."""

    question: int
    ticket: int
    text: str


@dataclass(frozen=True, kw_only=True)
class GmailReplyApproved(ReplyApproved):
    """An approved answer to a ticket that came from Gmail."""


@dataclass(frozen=True, kw_only=True)
class LinearReplyApproved(ReplyApproved):
    """An approved comment on a ticket that came from Linear."""


@dataclass(frozen=True, kw_only=True)
class CheckDue(Fact):
    """The integration's trigger says it is time to check its service."""

    agent: int


@dataclass(frozen=True, kw_only=True)
class GmailCheckDue(CheckDue):
    """Time to check Gmail."""


@dataclass(frozen=True, kw_only=True)
class LinearCheckDue(CheckDue):
    """Time to check Linear."""


@dataclass(frozen=True, kw_only=True)
class LinearStageMoved(Fact):
    """A ticket from Linear moved to a stage its issue has not been told about."""

    ticket: int
