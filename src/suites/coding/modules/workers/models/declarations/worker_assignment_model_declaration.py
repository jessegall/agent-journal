from engine.module.model_declaration import ModelDeclaration
from engine.module.model_declaration import ALL_SUBCOMMANDS
from suites.coding.modules.workers.models.worker_assignment import WorkerAssignment


class WorkerAssignmentModelDeclaration(ModelDeclaration):
    """How the module declares WorkerAssignment."""

    model = WorkerAssignment
    excluded_subcommands = ALL_SUBCOMMANDS
