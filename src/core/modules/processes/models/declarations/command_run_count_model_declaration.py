from engine.module.model_declaration import ModelDeclaration
from core.modules.processes.models.command_run_count import CommandRunCount


class CommandRunCountModelDeclaration(ModelDeclaration):
    """How the module declares CommandRunCount."""

    model = CommandRunCount
    excluded_subcommands = ["make", "edit", "delete"]
