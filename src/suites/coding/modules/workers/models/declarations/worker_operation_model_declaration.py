from engine.module.model_declaration import ModelDeclaration
from suites.coding.modules.workers.models.worker_operation import WorkerOperation
from suites.coding.modules.workers.queries.worker_operation_query import WorkerOperationQuery


class WorkerOperationModelDeclaration(ModelDeclaration):
    """How the module declares WorkerOperation."""

    model = WorkerOperation
    query = WorkerOperationQuery
    excluded_subcommands = ["make", "edit", "delete"]
