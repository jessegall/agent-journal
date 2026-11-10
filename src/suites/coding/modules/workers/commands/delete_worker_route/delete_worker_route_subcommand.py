from engine.cli.delete_subcommand import DeleteSubcommand
from core.base.model.table import Table
from suites.coding.modules.workers.commands.delete_worker_route.delete_worker_route import DeleteWorkerRoute
from suites.coding.modules.workers.models.worker_route import WorkerRoute


class DeleteWorkerRouteSubcommand(DeleteSubcommand):
    cli_name = "worker-route"

    def __init__(self) -> None:
        super().__init__(Table.build(WorkerRoute))
        self.command_class = DeleteWorkerRoute
