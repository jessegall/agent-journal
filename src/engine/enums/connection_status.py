from enum import StrEnum


class ConnectionStatus(StrEnum):
    """The latest result of the journal's internet connection check."""

    UNKNOWN = "unknown"
    ONLINE = "online"
    OFFLINE = "offline"
