from dataclasses import dataclass

from core.base.driver.rule_answer import RuleAnswer


@dataclass(frozen=True)
class RuleRecord:
    """One rule on a hook: the layer it was asked for, and what it answered, that it raised, or that it was
    silenced."""

    name: str
    layer: str
    outcome: str
    answer: RuleAnswer | None = None
    history: bool = False
