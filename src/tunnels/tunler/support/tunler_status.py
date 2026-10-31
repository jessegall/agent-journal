from dataclasses import dataclass


@dataclass(frozen=True)
class TunlerStatus:
    """Whether the tunler program is on this machine and logged in to its server."""

    installed: bool
    authenticated: bool
