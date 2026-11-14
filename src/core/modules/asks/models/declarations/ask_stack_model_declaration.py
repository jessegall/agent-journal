from engine.module.model_declaration import ModelDeclaration
from core.modules.asks.models.ask_stack import AskStack
from engine.module.model_declaration import BUILT


class AskStackModelDeclaration(ModelDeclaration):
    """How the module declares AskStack."""

    model = AskStack
    excluded_subcommands = BUILT
