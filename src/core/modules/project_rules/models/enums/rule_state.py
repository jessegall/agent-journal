from enum import StrEnum


class RuleState(StrEnum):
    """Where a project rule stands: proposed by an agent, active, denied by a person, or removed."""

    PROPOSED = "proposed"
    ACTIVE = "active"
    DENIED = "denied"
    REMOVED = "removed"
