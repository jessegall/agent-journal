from engine.module.model_declaration import ModelDeclaration
from core.modules.tasks.models.task_block_renewal import TaskBlockRenewal


class TaskBlockRenewalModelDeclaration(ModelDeclaration):
    """How the module declares TaskBlockRenewal."""

    model = TaskBlockRenewal
    excluded_subcommands = ["make", "edit", "delete"]
