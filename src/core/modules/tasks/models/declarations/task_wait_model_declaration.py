from engine.module.model_declaration import ModelDeclaration
from core.modules.tasks.models.task_wait import TaskWait


class TaskWaitModelDeclaration(ModelDeclaration):
    """How the module declares TaskWait."""

    model = TaskWait
    excluded_subcommands = ["make", "edit", "delete"]
