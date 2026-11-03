from core.base.journal_home import JournalHome
from core.base.server_restart_state import ServerRestartState
from server.viewer.server_state import ServerState


class ServerStateRoute:
    """Answers GET /api/server-state from the files the server and the installer leave, so a page that lost
    the server can tell when it is back."""

    def __init__(self, home: JournalHome) -> None:
        self.restart_state = ServerRestartState(home)

    def state(self) -> ServerState:
        return ServerState(self.restart_state.is_restarting, self.restart_state.is_updating)
