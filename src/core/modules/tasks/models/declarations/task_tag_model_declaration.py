from engine.module.model_declaration import ModelDeclaration
from core.modules.tasks.models.task_tag import TaskTag


class TaskTagModelDeclaration(ModelDeclaration):
    """How the module declares TaskTag."""

    model = TaskTag
    excluded_subcommands = ["make", "edit", "delete"]
