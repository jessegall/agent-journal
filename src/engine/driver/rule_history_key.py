from dataclasses import dataclass


@dataclass(frozen=True)
class RuleHistoryKey:
    """What a rule's history is kept for: one agent, one rule and the layer the rule was asked for."""

    agent_id: int
    rule: str
    layer: str
