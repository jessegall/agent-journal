from server.viewer.session_answer import SessionAnswer
from server.viewer.viewer_login import ViewerLogin


class SessionRoute:
    """GET /api/session: the session type of the cookie the shell was opened with, so it can pick its face."""

    def __init__(self, login: ViewerLogin) -> None:
        self.login = login

    def answer(self, token: str) -> SessionAnswer:
        session = self.login.session(token)
        return SessionAnswer(session.type, session.person_id)
