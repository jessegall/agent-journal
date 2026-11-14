from engine.module.model_declaration import ModelDeclaration
from core.modules.assign_rules.models.assign_rule import AssignRule
from core.modules.assign_rules.support.excluded_writes import EXCLUDED_WRITES


class AssignRuleModelDeclaration(ModelDeclaration):
    """How the module declares AssignRule."""

    model = AssignRule
    excluded_subcommands = EXCLUDED_WRITES
