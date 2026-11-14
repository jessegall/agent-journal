from engine.module.model_declaration import ModelDeclaration
from suites.coding.modules.workers.models.worker_test_failure import WorkerTestFailure


class WorkerTestFailureModelDeclaration(ModelDeclaration):
    """How the module declares WorkerTestFailure."""

    model = WorkerTestFailure
    excluded_subcommands = ["make", "edit", "delete", "show", "list"]
