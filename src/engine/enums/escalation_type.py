from enum import StrEnum


class EscalationType(StrEnum):
    """Which refusal count reached its limit and opened an escalation."""

    STOPS = "stops"
    TOOLS = "tools"
    # a hold whose condition cannot be judged, which a person repairs
    REPAIR = "repair"
