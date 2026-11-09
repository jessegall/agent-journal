from dataclasses import dataclass

from core.base.model.model import Model
from core.modules.assign_rules.models.enums.condition_field import ConditionField
from core.modules.assign_rules.models.enums.condition_operator import ConditionOperator


@dataclass(frozen=True, kw_only=True)
class AssignRuleCondition(Model):
    """One condition of an assign rule; a task must meet all of a rule's conditions."""

    model_name = "assign_rule_condition"
    cli_name = "assign-rule-condition"

    rule_id: int
    field: ConditionField
    operator: ConditionOperator
    value: str = ""
