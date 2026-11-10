from enum import StrEnum


class ClosedService(StrEnum):
    """The server parts a hosted journal does not start yet."""

    TUNNEL = "tunnel"
    PLUGIN_SERVICES = "plugin services"
    PLUGIN_SCRIPTS = "plugin scripts"
