from dataclasses import dataclass


@dataclass(frozen=True)
class TunlerStatus:
    """Whether the tunler program is on this machine and logged in to its server, as whom and where, the path
    it runs from, and whether its server no longer accepts a saved login."""

    installed: bool
    authenticated: bool
    account: str | None = None
    host: str | None = None
    command: str | None = None
    rejected: bool = False
