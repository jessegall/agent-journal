from server.viewer.share_sessions import ShareSessions

OPEN = 200
UNKNOWN = 404
ENDED = 410


class ShareRoute:
    """GET /viewer/share/<token>: whether the link opens the shell, has ended or been revoked, or never was."""

    def __init__(self, shares: ShareSessions) -> None:
        self.shares = shares

    def status(self, token: str) -> int:
        link = self.shares.link(token)
        if link is None:
            return UNKNOWN
        return OPEN if link.is_open() else ENDED
