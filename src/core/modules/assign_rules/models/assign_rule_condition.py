from dataclasses import dataclass

from engine.model.model import Model
from core.modules.assign_rules.models.enums.condition_field import ConditionField
from core.modules.assign_rules.models.enums.condition_operator import ConditionOperator
from core.modules.assign_rules.models.support.condition_checks import check_condition
from core.modules.assign_rules.models.support.task_facts import TaskFacts


@dataclass(frozen=True, kw_only=True)
class AssignRuleCondition(Model):
    """One condition of an assign rule; a task must meet all of a rule's conditions."""

    model_name = "assign_rule_condition"
    cli_name = "assign-rule-condition"

    rule_id: int
    field: ConditionField
    operator: ConditionOperator
    value: str = ""

    def matches(self, facts: TaskFacts) -> bool:
        return check_condition(self.field, self.operator, self.value, facts)
