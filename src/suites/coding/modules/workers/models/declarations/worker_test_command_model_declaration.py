from engine.module.model_declaration import ModelDeclaration
from engine.module.model_declaration import ALL_SUBCOMMANDS
from suites.coding.modules.workers.models.worker_test_command import WorkerTestCommand


class WorkerTestCommandModelDeclaration(ModelDeclaration):
    """How the module declares WorkerTestCommand."""

    model = WorkerTestCommand
    excluded_subcommands = ALL_SUBCOMMANDS
