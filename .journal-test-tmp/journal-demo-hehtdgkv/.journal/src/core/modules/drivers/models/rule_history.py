from dataclasses import dataclass

from core.base.model.model import Model
from core.base.timestamp import Timestamp
from core.modules.drivers.models.enums.rule_due_outcome import RuleDueOutcome


@dataclass(frozen=True, kw_only=True)
class RuleHistory(Model):
    """What happened to one rule for one agent and layer the last time it was due, and when it last answered
    with lines or a refusal."""

    model_name = "rule_history"
    cli_name = "rule-history"

    agent_id: int
    creator_id: int
    rule: str
    layer: str = ""
    last_due_outcome: RuleDueOutcome = RuleDueOutcome.CONSULTED
    last_answer_at: Timestamp | None = None
