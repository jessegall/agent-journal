from engine.module.model_declaration import ModelDeclaration
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.queries.process_part_query import ProcessPartQuery


class ProcessPartModelDeclaration(ModelDeclaration):
    """How the module declares ProcessPart."""

    model = ProcessPart
    query = ProcessPartQuery
    excluded_subcommands = ["make", "edit"]
