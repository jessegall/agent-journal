import secrets
import threading

from server.viewer.unknown_login_key import UnknownLoginKey

KEY_BYTES = 24


class ViewerLogin:
    """The viewer's logins: a one-time key the person opens, spent on first use, and the session token it leaves in
    a cookie, each naming the person the viewer acts for."""

    def __init__(self) -> None:
        self.lock = threading.Lock()
        self.keys: dict[str, int] = {}
        self.sessions: dict[str, int] = {}

    def new_key(self, person_id: int) -> str:
        key = secrets.token_urlsafe(KEY_BYTES)
        with self.lock:
            self.keys[key] = person_id
        return key

    def has_session(self, token: str) -> bool:
        with self.lock:
            return token in self.sessions

    def session_token(self, key: str) -> str:
        token = secrets.token_urlsafe(KEY_BYTES)
        with self.lock:
            if key not in self.keys:
                raise UnknownLoginKey("this login key is spent or unknown: ask journal viewer for a new one")
            self.sessions[token] = self.keys.pop(key)
        return token

    def person_id(self, token: str) -> int:
        with self.lock:
            return self.sessions[token]
