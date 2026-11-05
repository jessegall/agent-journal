from dataclasses import dataclass

from core.base.model.model import Model
from core.modules.project_rules.models.enums.rule_state import RuleState
from core.modules.project_rules.models.lifecycles.rule_lifecycle import RuleLifecycle


@dataclass(frozen=True, kw_only=True)
class ProjectRule(Model):
    """A standing instruction for the whole project: it never fades, and every agent gets it when it starts."""

    model_name = "rule"
    cli_name = "rule"
    search_fields = ["text"]
    lifecycle = RuleLifecycle

    creator_id: int
    text: str
    state: RuleState = RuleState.ACTIVE
