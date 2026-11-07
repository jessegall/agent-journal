from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from suites.coding.modules.workers.commands.move_worker_route.move_worker_route import MoveWorkerRoute
from suites.coding.modules.workers.models.worker_route import WorkerRoute


class MoveWorkerRouteSubcommand(Subcommand[MoveWorkerRoute, WorkerRoute]):
    cli_name = "worker-route"
    name = "move"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("route_id", type=int)
        parser.add_argument("--to", type=int, required=True, dest="position")

    def command(self, arguments: Namespace, caller: Caller) -> MoveWorkerRoute:
        return MoveWorkerRoute(arguments.route_id, arguments.position)
