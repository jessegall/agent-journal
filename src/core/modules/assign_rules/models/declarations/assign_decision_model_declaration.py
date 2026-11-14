from engine.module.model_declaration import ModelDeclaration
from core.modules.assign_rules.models.assign_decision import AssignDecision
from core.modules.assign_rules.support.excluded_writes import EXCLUDED_WRITES


class AssignDecisionModelDeclaration(ModelDeclaration):
    """How the module declares AssignDecision."""

    model = AssignDecision
    excluded_subcommands = EXCLUDED_WRITES
