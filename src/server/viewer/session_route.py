from engine.database.write_turns import WriteTurns
from engine.database.database import Database
from engine.module.journal_container import synced_container
from engine.journal.journal_home import JournalHome
from engine.registry.registry import Registry
from server.viewer.session_answer import SessionAnswer
from server.viewer.share_answer import ShareAnswer
from server.viewer.shared_row import SharedRow
from server.viewer.shared_windows import SharedWindows
from server.viewer.viewer_login import ViewerLogin
from engine.registry.window_listing import WindowListing
from engine.setting.setting_values import SettingValues
from core.modules.viewer.commands.support.window_setting_keys import TOUR_COMPLETED


class SessionRoute:
    """GET /api/session: the session type of the cookie the shell was opened with, so it can pick its face;
    for a share session also the row, the window the server picked for it and when the link ends."""

    def __init__(self, login: ViewerLogin, home: JournalHome, turns: WriteTurns | None = None) -> None:
        self.login, self.home, self.turns = login, home, turns

    def answer(self, token: str) -> SessionAnswer:
        session = self.login.session(token)
        if session.shared is None:
            return SessionAnswer(session.type, session.person_id, tour_completed=self.tour_completed())
        shared = session.shared
        environment = self.login.shares.environment_name(shared.environment_id)
        return SessionAnswer(session.type, session.person_id, ShareAnswer(shared.model, shared.id, self.window(shared), environment, session.ends_at.text if session.ends_at else None, session.comments))

    def tour_completed(self) -> bool:
        container = synced_container(self.home, self.turns)
        try:
            return container.get(SettingValues).project.flag(TOUR_COMPLETED)
        finally:
            container.get(Database).close()

    def window(self, shared: SharedRow) -> WindowListing:
        container = synced_container(self.home, self.turns)
        try:
            registry = container.get(Registry)
            window = SharedWindows(registry).window(shared.model)
            return window.listing(registry.module_fingerprints[window.module])
        finally:
            container.get(Database).close()
