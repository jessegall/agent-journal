from engine.module.model_declaration import ModelDeclaration
from core.modules.waits.models.wait_target import WaitTarget


class WaitTargetModelDeclaration(ModelDeclaration):
    """How the module declares WaitTarget."""

    model = WaitTarget
    excluded_subcommands = ["make", "edit"]
