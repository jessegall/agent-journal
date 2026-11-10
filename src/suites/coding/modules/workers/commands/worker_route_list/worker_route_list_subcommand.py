from argparse import Namespace

from engine.caller.caller import Caller
from core.base.provider.providers import Providers
from engine.subcommand.read_subcommand import ReadSubcommand
from engine.subcommand.row_list import RowList
from suites.coding.modules.workers.support.worker_routes import WorkerRoutes


class WorkerRouteListSubcommand(ReadSubcommand[RowList]):
    """Lists routes in their order, including destinations whose module is gone."""

    cli_name = "worker-route"
    name = "list"
    row_line = "{id}  position {position}  {program}  {tier}  {tags}  {status}"
    empty_line = "nothing found"

    def __init__(self, routes: WorkerRoutes, providers: Providers) -> None:
        self.routes, self.providers = routes, providers

    def read(self, arguments: Namespace, caller: Caller) -> RowList:
        programs = {provider.name for provider in self.providers.all()}
        return RowList([{"id": route.id, "position": route.position, "program": route.program,
                         "tier": route.tier, "tags": route.tags, "complexity_from": route.minimum_complexity,
                         "complexity_to": route.maximum_complexity, "strict": route.strict, "creator_id": route.creator_id,
                         "status": "gone" if route.program and route.program not in programs else "ready"}
                        for route in self.routes.listed()])
