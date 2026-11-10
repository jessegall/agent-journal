from dataclasses import dataclass
from engine.version.journal_version import JOURNAL_VERSION
from server.enums.session_type import SessionType
from server.viewer.share_answer import ShareAnswer


@dataclass(frozen=True)
class SessionAnswer:
    """What GET /api/session tells the shell about the cookie: its session type, the person it acts for and,
    for a share session, the link it opened."""

    type: SessionType
    person_id: int | None
    share: ShareAnswer | None = None
    tour_completed: bool = False
    journal_version: str = JOURNAL_VERSION
