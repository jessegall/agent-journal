import secrets
import threading

from server.viewer.phone_sessions import PhoneSessions
from server.viewer.session_type import SessionType
from server.viewer.share_session_error import ShareSessionError
from server.viewer.unknown_login_key_error import UnknownLoginKeyError
from server.viewer.viewer_session import ViewerSession

KEY_BYTES = 24


class ViewerLogin:
    """The viewer's logins: a one-time key opened once, and the session token it leaves in a cookie, each naming
    who the viewer acts for: a person, a person's phone, or one share; a paired phone's token is not held here
    but asked of the phone module, so it outlives a restart and ends when the phone is unpaired."""

    def __init__(self, phones: PhoneSessions) -> None:
        self.phones = phones
        self.lock = threading.Lock()
        self.keys: dict[str, ViewerSession] = {}
        self.sessions: dict[str, ViewerSession] = {}

    def new_key(self, person_id: int, session_type: SessionType = SessionType.PERSON) -> str:
        return self.session_key(ViewerSession(session_type, person_id=person_id))

    def new_share_key(self, share_id: int) -> str:
        return self.session_key(ViewerSession(SessionType.SHARE, share_id=share_id))

    def session_key(self, session: ViewerSession) -> str:
        key = secrets.token_urlsafe(KEY_BYTES)
        with self.lock:
            self.keys[key] = session
        return key

    def has_session(self, token: str) -> bool:
        with self.lock:
            if token in self.sessions:
                return True
        return bool(token) and self.phones.person_id(token) is not None

    def session_token(self, key: str) -> str:
        token = secrets.token_urlsafe(KEY_BYTES)
        with self.lock:
            if key not in self.keys:
                raise UnknownLoginKeyError("this login key is spent or unknown: ask journal viewer for a new one")
            self.sessions[token] = self.keys.pop(key)
        return token

    def session(self, token: str) -> ViewerSession:
        with self.lock:
            if token in self.sessions:
                return self.sessions[token]
        person_id = self.phones.person_id(token)
        if person_id is None:
            raise UnknownLoginKeyError("this session is unknown: open the address journal viewer prints to log in")
        return ViewerSession(SessionType.PHONE, person_id=person_id)

    def person_id(self, token: str) -> int:
        session = self.session(token)
        if session.person_id is None:
            raise ShareSessionError("a share link opens only what was shared")
        return session.person_id
