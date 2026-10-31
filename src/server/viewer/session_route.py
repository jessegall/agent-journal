from core.base.database.database import Database
from core.base.journal_container import synced_container
from core.base.journal_home import JournalHome
from core.base.registry.registry import Registry
from server.viewer.session_answer import SessionAnswer, ShareAnswer
from server.viewer.shared_row import SharedRow
from server.viewer.shared_windows import SharedWindows
from server.viewer.viewer_login import ViewerLogin
from server.viewer.viewer_window import ViewerWindow


class SessionRoute:
    """GET /api/session: the session type of the cookie the shell was opened with, so it can pick its face; for
    a share session also the row, the window the server picked for it and when the link ends."""

    def __init__(self, login: ViewerLogin, home: JournalHome) -> None:
        self.login, self.home = login, home

    def answer(self, token: str) -> SessionAnswer:
        session = self.login.session(token)
        if session.shared is None or session.ends_at is None:
            return SessionAnswer(session.type, session.person_id)
        shared = session.shared
        environment = self.login.shares.environment_name(shared.environment_id)
        return SessionAnswer(session.type, session.person_id, ShareAnswer(shared.model, shared.id, self.window(shared), environment, session.ends_at.text))

    def window(self, shared: SharedRow) -> ViewerWindow:
        container = synced_container(self.home)
        try:
            registry = container.get(Registry)
            window = SharedWindows(registry).window(shared.model)
            return ViewerWindow.listed(window, registry.module_fingerprints[window.module])
        finally:
            container.get(Database).close()
