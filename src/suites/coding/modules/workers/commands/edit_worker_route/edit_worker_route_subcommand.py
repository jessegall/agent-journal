from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from suites.coding.modules.workers.commands.edit_worker_route.edit_worker_route import EditWorkerRoute
from suites.coding.modules.workers.models.worker_route import WorkerRoute
from suites.coding.modules.workers.support.worker_route_arguments import WorkerRouteArguments


class EditWorkerRouteSubcommand(Subcommand[EditWorkerRoute, WorkerRoute]):
    cli_name = "worker-route"
    name = "edit"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("row_id", type=int)
        WorkerRouteArguments.add(parser)

    def command(self, arguments: Namespace, caller: Caller) -> EditWorkerRoute:
        return EditWorkerRoute(row_id=arguments.row_id, **WorkerRouteArguments.values(arguments))
