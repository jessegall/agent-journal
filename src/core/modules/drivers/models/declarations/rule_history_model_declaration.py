from engine.module.model_declaration import ModelDeclaration
from core.modules.drivers.models.rule_history import RuleHistory


class RuleHistoryModelDeclaration(ModelDeclaration):
    """How the module declares RuleHistory."""

    model = RuleHistory
    excluded_subcommands = ["make", "edit"]
