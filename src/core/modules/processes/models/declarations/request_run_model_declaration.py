from engine.module.model_declaration import ModelDeclaration
from core.modules.processes.models.request_run import RequestRun
from core.modules.processes.queries.request_run_query import RequestRunQuery


class RequestRunModelDeclaration(ModelDeclaration):
    """How the module declares RequestRun."""

    model = RequestRun
    query = RequestRunQuery
    excluded_subcommands = ["make", "edit", "delete"]
