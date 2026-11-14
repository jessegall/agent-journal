from engine.module.model_declaration import ModelDeclaration
from core.modules.pins.models.pin import Pin
from core.modules.pins.queries.pin_query import PinQuery


class PinModelDeclaration(ModelDeclaration):
    """How the module declares Pin."""

    model = Pin
    query = PinQuery
    excluded_subcommands = ["make", "edit", "list", "delete"]
