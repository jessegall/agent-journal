from dataclasses import dataclass


@dataclass(frozen=True)
class TunlerStatus:
    """What tunler says of itself: whether it is installed and where, and the account and server it is logged in to."""

    installed: bool
    command: str = ""
    logged_in: bool = False
    rejected: bool = False
    """Logged in, but the server no longer accepts the login."""
    outdated: bool = False
    """Too old to say whether its login still works."""
    account: str = ""
    host: str = ""
    unreadable: bool = False
    """It answered, but not with a status the journal can read."""
