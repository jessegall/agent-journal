from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.subcommand import Subcommand
from suites.coding.modules.workers.commands.make_worker_route.make_worker_route import MakeWorkerRoute
from suites.coding.modules.workers.models.worker_route import WorkerRoute
from suites.coding.modules.workers.support.worker_route_arguments import WorkerRouteArguments


class MakeWorkerRouteSubcommand(Subcommand[MakeWorkerRoute, WorkerRoute]):
    cli_name = "worker-route"
    name = "make"

    def arguments(self, parser: ArgumentParser) -> None:
        WorkerRouteArguments.add(parser)

    def command(self, arguments: Namespace, caller: Caller) -> MakeWorkerRoute:
        return MakeWorkerRoute(**WorkerRouteArguments.values(arguments))
