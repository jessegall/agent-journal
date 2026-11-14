from dataclasses import dataclass

from core.modules.assign_rules.models.enums.decision_outcome import DecisionOutcome


@dataclass(frozen=True)
class DecisionNote:
    """An outcome the rules reach about a task before any rule is tried, and the reason for it."""

    outcome: DecisionOutcome
    reason: str
