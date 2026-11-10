from core.base.file_access import FileAccess
from engine.types.type_guards import is_mapping
import hashlib
import json
from pathlib import Path

from server.viewer.session_type import SessionType
from server.viewer.viewer_session import ViewerSession

KEPT_TYPES = (SessionType.PERSON, SessionType.AGENT)


class SessionFile:
    """The viewer sessions of people and of the main agent, token to who it acts for, kept in a file only its owner
    reads, so a browser stays logged in when the server restarts. A person is kept as a number, an agent as
    {"agent": number}."""

    def __init__(self, path: Path) -> None:
        self.path = path

    @property
    def cookie_suffix(self) -> str:
        return hashlib.sha256(str(self.path.resolve()).encode()).hexdigest()[:12]

    def load(self) -> dict[str, ViewerSession]:
        if not self.path.is_file():
            return {}
        try:
            kept: object = json.loads(FileAccess.shared().read(self.path))
        except ValueError:
            return {}
        if not is_mapping(kept):
            return {}
        sessions = {str(token): self.session(value) for token, value in kept.items()}
        return {token: session for token, session in sessions.items() if session is not None}

    @staticmethod
    def session(value: object) -> ViewerSession | None:
        if isinstance(value, int) and not isinstance(value, bool):
            return ViewerSession(SessionType.PERSON, person_id=value)
        agent = value.get("agent") if is_mapping(value) else None
        return ViewerSession(SessionType.AGENT, person_id=agent) if isinstance(agent, int) and not isinstance(agent, bool) else None

    def save(self, sessions: dict[str, ViewerSession]) -> None:
        kept = {token: session.person_id if session.type is SessionType.PERSON else {"agent": session.person_id} for token, session in sessions.items()
                if session.type in KEPT_TYPES and session.person_id is not None}
        with FileAccess.shared().private_writer(self.path) as file:
            file.write(json.dumps(kept))
