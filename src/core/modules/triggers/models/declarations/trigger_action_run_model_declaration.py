from engine.module.model_declaration import ModelDeclaration
from core.modules.triggers.models.trigger_action_run import TriggerActionRun


class TriggerActionRunModelDeclaration(ModelDeclaration):
    """How the module declares TriggerActionRun."""

    model = TriggerActionRun
    excluded_subcommands = ["make", "edit", "list", "show", "delete"]
