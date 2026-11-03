from dataclasses import dataclass


@dataclass(frozen=True)
class ServerState:
    """What GET /api/server-state answers: whether a restart is marked, whether an install holds the server, and
    when this server started."""

    restarting: bool
    updating: bool
    started_at: str = ""
