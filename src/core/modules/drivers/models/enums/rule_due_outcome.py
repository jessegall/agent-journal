from enum import StrEnum


class RuleDueOutcome(StrEnum):
    """What happened to a rule with history the last time it was due: it was asked, or an overlay silenced it."""

    CONSULTED = "consulted"
    SILENCED = "silenced"
