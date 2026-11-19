from dataclasses import dataclass
from urllib.parse import SplitResult, parse_qs, urlsplit

from journal.support.rejection import Rejection

LOCAL_HOSTS = ("localhost", "127.0.0.1")


@dataclass(frozen=True)
class CallbackAddress:
    """Where a sign-in program waits for the browser to come back: plain http on this machine, at its port and path, and the one request to it a pasted address may make."""

    port: int
    path: str

    @classmethod
    def of(cls, authorization: str) -> "CallbackAddress":
        returns = parse_qs(urlsplit(authorization).query).get("redirect_uri", [""])[0]
        parts = urlsplit(returns)
        if parts.scheme != "http" or parts.hostname not in LOCAL_HOSTS or not cls.port_of(parts):
            raise Rejection("the sign-in asks the browser to come back somewhere other than this machine, so the journal cannot finish it")
        return cls(cls.port_of(parts), parts.path or "/")

    @staticmethod
    def port_of(parts: SplitResult) -> int:
        try:
            return parts.port or 0
        except ValueError:
            return 0

    def target(self, pasted: str) -> str:
        """The path and query to ask the waiting program for, from the address the user's browser ended on; anything but that address is refused, and the refusal never repeats it."""
        text = pasted.strip()
        if not text or any(ord(c) <= 32 or ord(c) == 127 for c in text):
            raise Rejection("paste the whole address from the browser's address bar, on one line")
        parts = urlsplit(text)
        if parts.scheme != "http" or parts.hostname not in LOCAL_HOSTS or parts.username is not None or parts.password is not None:
            raise Rejection("the address must start with http://localhost or http://127.0.0.1")
        if self.port_of(parts) != self.port or parts.path != self.path:
            raise Rejection(f"the address is not the one this sign-in waits on, http://localhost:{self.port}{self.path}: press Sign in again and use the newest sign-in page")
        if not parts.query:
            raise Rejection("the address has no answer from the sign-in page after the ?: copy it again, whole")
        return f"{self.path}?{parts.query}"
