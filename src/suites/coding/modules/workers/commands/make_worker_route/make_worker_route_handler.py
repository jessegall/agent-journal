from core.modules.helpers.support.program_change_access import ProgramChangeAccess
from engine.command.context import Context
from engine.command.handler import Handler
from engine.errors.refusal import Refusal
from engine.repository.repository import Repository
from core.modules.plans.support.positions import Positions
from suites.coding.modules.workers.commands.make_worker_route.make_worker_route import MakeWorkerRoute
from suites.coding.modules.workers.models.worker_route import WorkerRoute


class MakeWorkerRouteHandler(Handler[MakeWorkerRoute, WorkerRoute]):
    """Adds a route after the environment's last route."""

    command = MakeWorkerRoute

    def __init__(self, positions: Positions, repository: Repository, access: ProgramChangeAccess) -> None:
        self.positions, self.repository = positions, repository
        self.access = access

    def handle(self, command: MakeWorkerRoute, context: Context) -> WorkerRoute:
        self.access.check(context.actor)
        if context.environment_id is None:
            raise Refusal("a route needs an environment", "add --environment <name>")
        return self.repository.save(WorkerRoute(creator_id=context.actor.id,
                                               position=self.positions.next_position(WorkerRoute, "environment_id", context.environment_id),
                                               program=command.program, tags=command.tags, minimum_complexity=command.minimum_complexity,
                                               maximum_complexity=command.maximum_complexity, tier=command.tier, strict=command.strict), context)
