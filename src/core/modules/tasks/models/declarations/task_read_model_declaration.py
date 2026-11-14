from engine.module.model_declaration import ModelDeclaration
from core.modules.tasks.models.task_read import TaskRead


class TaskReadModelDeclaration(ModelDeclaration):
    """How the module declares TaskRead."""

    model = TaskRead
    excluded_subcommands = ["make", "edit", "show", "list", "delete"]
