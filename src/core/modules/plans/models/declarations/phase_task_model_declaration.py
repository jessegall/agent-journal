from engine.module.model_declaration import ModelDeclaration
from core.modules.plans.models.phase_task import PhaseTask


class PhaseTaskModelDeclaration(ModelDeclaration):
    """How the module declares PhaseTask."""

    model = PhaseTask
    excluded_subcommands = ["make", "edit"]
