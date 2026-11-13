from dataclasses import dataclass

from server.viewer.viewer_session import ViewerSession


@dataclass(frozen=True)
class CookieSession:
    """The token of the session cookie a request sent and the session that token names."""

    token: str
    session: ViewerSession
