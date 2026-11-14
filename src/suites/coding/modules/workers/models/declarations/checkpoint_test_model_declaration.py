from engine.module.model_declaration import ModelDeclaration
from suites.coding.modules.workers.models.checkpoint_test import CheckpointTest


class CheckpointTestModelDeclaration(ModelDeclaration):
    """How the module declares CheckpointTest."""

    model = CheckpointTest
    excluded_subcommands = ["make", "edit", "delete"]
