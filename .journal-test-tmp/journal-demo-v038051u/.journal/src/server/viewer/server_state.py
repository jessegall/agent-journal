from dataclasses import dataclass

from core.base.connection_status import ConnectionStatus


@dataclass(frozen=True)
class ServerState:
    """What GET /api/server-state answers: whether a restart is marked, whether an install holds the server, and
    when this server started."""

    restarting: bool
    updating: bool
    started_at: str = ""
    connection: ConnectionStatus = ConnectionStatus.UNKNOWN
