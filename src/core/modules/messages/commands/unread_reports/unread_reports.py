from dataclasses import dataclass
from core.modules.messages.models.message import Message


@dataclass(frozen=True)
class UnreadReports:
    """One page of unread reports, newest page first and oldest first on a page, and how many there are in all."""

    reports: tuple[Message, ...]
    total: int
    page: int
