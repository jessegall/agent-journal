from engine.module.model_declaration import ModelDeclaration
from core.modules.asks.models.ask_step import AskStep
from engine.module.model_declaration import BUILT


class AskStepModelDeclaration(ModelDeclaration):
    """How the module declares AskStep."""

    model = AskStep
    excluded_subcommands = BUILT
