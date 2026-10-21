from dataclasses import dataclass


@dataclass(frozen=True)
class TunlerStatus:
    """What tunler says of itself: whether it is installed and where, and the account and server it is logged in to."""

    installed: bool
    command: str = ""
    logged_in: bool = False
    rejected: bool = False
    outdated: bool = False
    account: str = ""
    host: str = ""
    unreadable: bool = False
