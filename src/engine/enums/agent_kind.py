from enum import StrEnum


class AgentKind(StrEnum):
    """What a suite's default state is given by: an agent's role, the driver that drives it, or its helper type."""

    ROLE = "role"
    DRIVER = "driver"
    HELPER_TYPE = "helper-type"
