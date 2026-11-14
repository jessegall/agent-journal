from engine.module.model_declaration import ModelDeclaration
from engine.module.model_declaration import ALL_SUBCOMMANDS
from suites.coding.modules.workers.models.worker_test_run import WorkerTestRun


class WorkerTestRunModelDeclaration(ModelDeclaration):
    """How the module declares WorkerTestRun."""

    model = WorkerTestRun
    excluded_subcommands = ALL_SUBCOMMANDS
