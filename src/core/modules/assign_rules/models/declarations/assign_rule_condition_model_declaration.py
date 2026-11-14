from engine.module.model_declaration import ModelDeclaration
from core.modules.assign_rules.models.assign_rule_condition import AssignRuleCondition
from core.modules.assign_rules.support.excluded_writes import EXCLUDED_WRITES


class AssignRuleConditionModelDeclaration(ModelDeclaration):
    """How the module declares AssignRuleCondition."""

    model = AssignRuleCondition
    excluded_subcommands = EXCLUDED_WRITES
