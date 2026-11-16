from engine.module.model_declaration import ModelDeclaration
from core.modules.asks.models.helper_question import HelperQuestion
from core.modules.asks.queries.ask_query import AskQuery
from engine.module.model_declaration import BUILT


class AskModelDeclaration(ModelDeclaration):
    """How the module declares Ask."""

    model = HelperQuestion
    query = AskQuery
    excluded_subcommands = BUILT
