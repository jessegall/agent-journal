from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.listener.event_rows import EventRows
from core.base.repository.repository import Repository
from core.modules.plans.support.positions import Positions
from suites.coding.modules.workers.commands.delete_worker_route.delete_worker_route import DeleteWorkerRoute
from suites.coding.modules.workers.models.worker_route import WorkerRoute


class DeleteWorkerRouteHandler(Handler[DeleteWorkerRoute, None]):
    """Deletes a route and closes its gap in the order."""

    command = DeleteWorkerRoute

    def __init__(self, rows: EventRows, repository: Repository, positions: Positions) -> None:
        self.rows, self.repository, self.positions = rows, repository, positions

    def handle(self, command: DeleteWorkerRoute, context: Context) -> None:
        route = self.rows.required(WorkerRoute, command.row_id)
        self.repository.delete_stored(route, context)
        self.positions.renumber(WorkerRoute, "environment_id", route.environment_id, route.position, context)
