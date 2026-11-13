from dataclasses import dataclass

from server.viewer.viewer_session import ViewerSession


@dataclass(frozen=True)
class CookieSession:
    """The token of the session cookie a request sent and the session that token names; both are empty when the
    request sent no cookie that names a session."""

    token: str
    session: ViewerSession | None
