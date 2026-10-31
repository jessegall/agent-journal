from enum import StrEnum


class RuleSighting(StrEnum):
    """What happened to a rule with history the last time it was due: it was asked, or an overlay silenced it."""

    ASKED = "asked"
    SILENCED = "silenced"
