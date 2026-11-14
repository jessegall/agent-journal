from engine.module.model_declaration import ModelDeclaration
from engine.module.model_declaration import ALL_SUBCOMMANDS
from suites.coding.modules.workers.models.worker_task_source import WorkerTaskSource


class WorkerTaskSourceModelDeclaration(ModelDeclaration):
    """How the module declares WorkerTaskSource."""

    model = WorkerTaskSource
    excluded_subcommands = ALL_SUBCOMMANDS
