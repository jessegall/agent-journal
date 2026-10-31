from enum import StrEnum


class TunnelState(StrEnum):
    """Whether a tunnel reaches the viewer from outside now."""

    CONNECTED = "connected"
    DISCONNECTED = "disconnected"
    RECONNECTING = "reconnecting"
