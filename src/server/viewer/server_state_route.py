from engine.time.clock import Clock
from engine.journal.journal_home import JournalHome
from core.base.internet_connection import InternetConnection
from core.base.server_restart_state import ServerRestartState
from server.viewer.server_state import ServerState


class ServerStateRoute:
    """Answers GET /api/server-state from the files the server and the installer leave, so a page that lost
    the server can tell when it is back, and from its start time that it may run other code."""

    def __init__(self, home: JournalHome, clock: Clock) -> None:
        self.restart_state = ServerRestartState(home, clock)
        self.connection = InternetConnection.shared(home)
        self.started_at = clock.timestamp().text

    def state(self) -> ServerState:
        return ServerState(self.restart_state.is_restarting, self.restart_state.is_updating, self.started_at, self.connection.status)
