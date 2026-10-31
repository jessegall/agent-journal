from server.viewer.session_answer import SessionAnswer, ShareAnswer
from server.viewer.viewer_login import ViewerLogin


class SessionRoute:
    """GET /api/session: the session type of the cookie the shell was opened with, so it can pick its face."""

    def __init__(self, login: ViewerLogin) -> None:
        self.login = login

    def answer(self, token: str) -> SessionAnswer:
        session = self.login.session(token)
        if session.shared is None or session.ends_at is None:
            return SessionAnswer(session.type, session.person_id)
        shared = session.shared
        return SessionAnswer(session.type, session.person_id, ShareAnswer(shared.model, shared.id, self.login.shares.environment_name(shared.environment_id), session.ends_at.text))
