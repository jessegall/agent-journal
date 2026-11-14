from engine.module.model_declaration import ModelDeclaration
from core.modules.processes.models.reader import Reader
from core.modules.processes.queries.reader_query import ReaderQuery


class ReaderModelDeclaration(ModelDeclaration):
    """How the module declares Reader."""

    model = Reader
    query = ReaderQuery
    excluded_subcommands = ["make", "edit", "delete"]
