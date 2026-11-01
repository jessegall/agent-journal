import base64
import binascii

from server.viewer.share_password_tries import SharePasswordTries
from server.viewer.share_sessions import ShareSessions

OPEN = 200
PASSWORD_NEEDED = 401
UNKNOWN = 404
ENDED = 410
TOO_MANY_TRIES = 429
BASIC = "Basic "


class ShareRoute:
    """GET /viewer/share/<token>: whether the link opens the shell, asks for its password, has ended or been revoked, or never was; each opening counts as a view."""

    def __init__(self, shares: ShareSessions) -> None:
        self.shares = shares
        self.tries = SharePasswordTries()

    def status(self, token: str, authorization: str | None, address: str) -> int:
        link = self.shares.link(token)
        if link is None:
            return UNKNOWN
        if not link.is_open():
            return ENDED
        if link.locked and token not in self.shares.unlocked_tokens:
            refused = self.password_answer(token, authorization, address)
            if refused is not None:
                return refused
        self.shares.count_view(token)
        return OPEN

    def password_answer(self, token: str, authorization: str | None, address: str) -> int | None:
        if self.tries.is_locked_out(address):
            return TOO_MANY_TRIES
        password = self.password(authorization)
        if password is None:
            return PASSWORD_NEEDED
        if self.shares.unlock(token, password):
            return None
        self.tries.count(address)
        return PASSWORD_NEEDED

    @staticmethod
    def password(authorization: str | None) -> str | None:
        if authorization is None or not authorization.startswith(BASIC):
            return None
        try:
            return base64.b64decode(authorization.removeprefix(BASIC)).decode().partition(":")[2]
        except (binascii.Error, UnicodeDecodeError):
            return None
