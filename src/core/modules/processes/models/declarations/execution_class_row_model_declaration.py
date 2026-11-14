from engine.module.model_declaration import ModelDeclaration
from core.modules.processes.models.execution_class_row import ExecutionClassRow


class ExecutionClassRowModelDeclaration(ModelDeclaration):
    """How the module declares ExecutionClassRow."""

    model = ExecutionClassRow
    excluded_subcommands = ["make", "edit", "delete"]
