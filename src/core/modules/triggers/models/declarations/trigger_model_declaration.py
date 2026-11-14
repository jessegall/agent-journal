from engine.module.model_declaration import ModelDeclaration
from core.modules.triggers.models.trigger import Trigger
from core.modules.triggers.queries.trigger_query import TriggerQuery


class TriggerModelDeclaration(ModelDeclaration):
    """How the module declares Trigger."""

    model = Trigger
    query = TriggerQuery
    excluded_subcommands = ["make", "list", "delete"]
