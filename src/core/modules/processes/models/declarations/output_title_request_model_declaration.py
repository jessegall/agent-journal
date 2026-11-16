from engine.module.model_declaration import ModelDeclaration
from core.modules.processes.models.output_title_request import OutputTitleRequest


class OutputTitleRequestModelDeclaration(ModelDeclaration):
    """How the module declares OutputTitleRequest."""

    model = OutputTitleRequest
    excluded_subcommands = ["make", "edit", "delete"]
