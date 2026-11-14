from engine.module.model_declaration import ModelDeclaration
from core.modules.plans.models.checkpoint_pass import CheckpointPass


class CheckpointPassModelDeclaration(ModelDeclaration):
    """How the module declares CheckpointPass."""

    model = CheckpointPass
    excluded_subcommands = ["make", "edit", "delete"]
