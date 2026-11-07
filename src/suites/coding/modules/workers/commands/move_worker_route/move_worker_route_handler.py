from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.listener.event_rows import EventRows
from core.modules.plans.support.positions import Positions
from suites.coding.modules.workers.commands.move_worker_route.move_worker_route import MoveWorkerRoute
from suites.coding.modules.workers.models.worker_route import WorkerRoute


class MoveWorkerRouteHandler(Handler[MoveWorkerRoute, WorkerRoute]):
    """Moves a route within the environment's order."""

    command = MoveWorkerRoute

    def __init__(self, rows: EventRows, positions: Positions) -> None:
        self.rows, self.positions = rows, positions

    def handle(self, command: MoveWorkerRoute, context: Context) -> WorkerRoute:
        route = self.rows.required(WorkerRoute, command.route_id)
        return self.positions.move(route, "environment_id", route.environment_id, command.position, context)
