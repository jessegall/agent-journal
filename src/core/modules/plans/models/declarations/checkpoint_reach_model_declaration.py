from engine.module.model_declaration import ModelDeclaration
from core.modules.plans.commands.fail_checkpoint.fail_checkpoint import FailCheckpoint
from core.modules.plans.models.checkpoint_reach import CheckpointReach


class CheckpointReachModelDeclaration(ModelDeclaration):
    """How the module declares CheckpointReach."""

    model = CheckpointReach
    commands = (FailCheckpoint,)
    excluded_subcommands = ["make", "edit", "delete"]
