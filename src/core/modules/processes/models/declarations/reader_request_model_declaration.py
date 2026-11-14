from engine.module.model_declaration import ModelDeclaration
from core.modules.processes.models.reader_request import ReaderRequest
from core.modules.processes.queries.reader_request_query import ReaderRequestQuery


class ReaderRequestModelDeclaration(ModelDeclaration):
    """How the module declares ReaderRequest."""

    model = ReaderRequest
    query = ReaderRequestQuery
    excluded_subcommands = ["make", "edit", "delete"]
