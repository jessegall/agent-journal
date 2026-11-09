from dataclasses import dataclass

from core.base.model.model import Model
from core.modules.assign_rules.models.enums.decision_outcome import DecisionOutcome


@dataclass(frozen=True, kw_only=True)
class AssignDecision(Model):
    """What the assign rules decided about one task, and why; each task has one, updated in place."""

    model_name = "assign_decision"
    cli_name = "assign-decision"

    task_id: int
    rule_id: int | None = None
    outcome: DecisionOutcome
    actor_id: int | None = None
    reason: str = ""
