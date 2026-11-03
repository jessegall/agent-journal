from core.base.journal_home import JournalHome
from server.viewer.server_state import ServerState

MAINTENANCE_MARK = "maintenance"


class ServerStateRoute:
    """Answers GET /api/server-state from the marks the server and the installer write, so a page that lost
    the server can tell when it is back."""

    def __init__(self, home: JournalHome) -> None:
        self.home = home

    def state(self) -> ServerState:
        return ServerState(self.home.restart_mark.is_file(), (self.home.folder / MAINTENANCE_MARK).is_file())
