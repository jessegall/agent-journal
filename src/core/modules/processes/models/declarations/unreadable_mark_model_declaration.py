from engine.module.model_declaration import ModelDeclaration
from core.modules.processes.models.unreadable_mark import UnreadableMark
from core.modules.processes.queries.unreadable_mark_query import UnreadableMarkQuery


class UnreadableMarkModelDeclaration(ModelDeclaration):
    """How the module declares UnreadableMark."""

    model = UnreadableMark
    query = UnreadableMarkQuery
    excluded_subcommands = ["make", "edit", "delete"]
