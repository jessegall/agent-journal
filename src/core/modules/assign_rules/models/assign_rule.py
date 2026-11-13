from dataclasses import dataclass

from engine.model.environment_scoped import EnvironmentScoped
from engine.model.positioned import Positioned
from core.modules.assign_rules.models.enums.rule_target import RuleTarget


@dataclass(frozen=True, kw_only=True)
class AssignRule(EnvironmentScoped, Positioned):
    """A user's standing rule: a new free task that meets every condition is given to the target."""

    model_name = "assign_rule"
    cli_name = "assign-rule"

    creator_id: int
    position: int
    environment_id: int = 0
    enabled: bool = True
    target: RuleTarget
    agent_id: int | None = None
    program: str = ""
    program_model: str = ""
    queue_limit: int = 0
