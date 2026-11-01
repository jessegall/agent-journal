import base64
import binascii

from server.viewer.share_opening import ShareOpening
from server.viewer.share_password_tries import SharePasswordTries
from server.viewer.share_sessions import ShareSessions

OPEN = 200
PASSWORD_NEEDED = 401
UNKNOWN = 404
ENDED = 410
PASSWORD_TRY_LIMIT_STATUS = 429
BASIC = "Basic "
COOKIE_SEPARATOR = "."


class ShareRoute:
    """GET /viewer/share/<token>: whether the link opens the shell, asks for its password, has ended or been
    revoked, or never was; each opening counts as a view."""

    def __init__(self, shares: ShareSessions) -> None:
        self.shares = shares
        self.tries = SharePasswordTries()

    def opening(self, token: str, authorization: str | None, presented_cookie: str) -> ShareOpening:
        link = self.shares.link(token)
        if link is None:
            return ShareOpening(UNKNOWN)
        if not link.is_open():
            return ShareOpening(ENDED)
        presented_token, _, key = presented_cookie.partition(COOKIE_SEPARATOR)
        if not self.shares.is_locked(link, token, key if presented_token == token else ""):
            self.shares.count_view(token)
            return ShareOpening(OPEN, presented_cookie if link.locked else token)
        return self.password_opening(token, authorization)

    def password_opening(self, token: str, authorization: str | None) -> ShareOpening:
        if self.tries.is_blocked(token):
            return ShareOpening(PASSWORD_TRY_LIMIT_STATUS)
        password = self.password(authorization)
        if password is None:
            return ShareOpening(PASSWORD_NEEDED)
        key = self.shares.unlock(token, password)
        if key is None:
            self.tries.count(token)
            return ShareOpening(PASSWORD_NEEDED)
        self.shares.count_view(token)
        return ShareOpening(OPEN, f"{token}{COOKIE_SEPARATOR}{key}")

    @staticmethod
    def password(authorization: str | None) -> str | None:
        if authorization is None or not authorization.startswith(BASIC):
            return None
        try:
            return base64.b64decode(authorization.removeprefix(BASIC)).decode().partition(":")[2]
        except (binascii.Error, UnicodeDecodeError):
            return None
