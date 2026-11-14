from engine.module.model_declaration import ModelDeclaration
from core.modules.processes.models.output import Output
from core.modules.processes.queries.output_query import OutputQuery


class OutputModelDeclaration(ModelDeclaration):
    """How the module declares Output."""

    model = Output
    query = OutputQuery
    excluded_subcommands = ["make", "edit", "delete", "prune"]
