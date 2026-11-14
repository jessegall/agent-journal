from engine.module.model_declaration import ModelDeclaration
from suites.coding.modules.workers.models.worker_route import WorkerRoute


class WorkerRouteModelDeclaration(ModelDeclaration):
    """How the module declares WorkerRoute."""

    model = WorkerRoute
    excluded_subcommands = ["make", "edit", "delete", "list"]
