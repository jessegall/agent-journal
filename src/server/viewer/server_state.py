from dataclasses import dataclass


@dataclass(frozen=True)
class ServerState:
    """What GET /api/server-state answers: whether a restart is marked, and whether an install holds the server."""

    restarting: bool
    updating: bool
