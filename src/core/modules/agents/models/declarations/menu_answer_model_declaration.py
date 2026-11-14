from engine.module.model_declaration import ModelDeclaration
from core.modules.agents.models.menu_answer import MenuAnswer


class MenuAnswerModelDeclaration(ModelDeclaration):
    """How the module declares MenuAnswer."""

    model = MenuAnswer
    excluded_subcommands = ["make", "edit", "delete"]
