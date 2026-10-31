from server.viewer.phone_sessions import PhoneSessions
from server.viewer.share_link_session import ShareLinkSession
from server.viewer.share_sessions import ShareSessions


class NoPhones(PhoneSessions):
    """Phone sessions with no paired phone, for login tests that need no journal."""

    def __init__(self) -> None:
        return

    def person_id(self, token: str) -> int | None:
        return None


class NoShares(ShareSessions):
    """Share sessions with no link, for login tests that need no journal."""

    def __init__(self) -> None:
        return

    def link(self, token: str) -> ShareLinkSession | None:
        return None
