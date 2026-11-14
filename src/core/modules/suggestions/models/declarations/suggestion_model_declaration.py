from engine.module.model_declaration import ModelDeclaration
from core.modules.suggestions.models.suggestion import Suggestion


class SuggestionModelDeclaration(ModelDeclaration):
    """How the module declares Suggestion."""

    model = Suggestion
    excluded_subcommands = ["make", "edit", "list", "delete"]
