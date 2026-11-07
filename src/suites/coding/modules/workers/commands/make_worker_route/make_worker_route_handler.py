from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.plans.support.positions import Positions
from suites.coding.modules.workers.commands.make_worker_route.make_worker_route import MakeWorkerRoute
from suites.coding.modules.workers.models.worker_route import WorkerRoute


class MakeWorkerRouteHandler(Handler[MakeWorkerRoute, WorkerRoute]):
    """Adds a route after the environment's last route."""

    command = MakeWorkerRoute

    def __init__(self, positions: Positions, repository: Repository) -> None:
        self.positions, self.repository = positions, repository

    def handle(self, command: MakeWorkerRoute, context: Context) -> WorkerRoute:
        if context.environment_id is None:
            raise Refusal("a route needs an environment", "add --environment <name>")
        return self.repository.save(WorkerRoute(creator_id=context.actor.id,
                                               position=self.positions.next_position(WorkerRoute, "environment_id", context.environment_id),
                                               **command.field_values(())), context)
