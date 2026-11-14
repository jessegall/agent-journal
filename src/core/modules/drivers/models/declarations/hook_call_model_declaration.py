from engine.module.model_declaration import ModelDeclaration
from core.modules.drivers.models.hook_call import HookCall
from core.modules.drivers.queries.hook_call_query import HookCallQuery


class HookCallModelDeclaration(ModelDeclaration):
    """How the module declares HookCall."""

    model = HookCall
    query = HookCallQuery
    excluded_subcommands = ["make", "edit", "delete", "show"]
