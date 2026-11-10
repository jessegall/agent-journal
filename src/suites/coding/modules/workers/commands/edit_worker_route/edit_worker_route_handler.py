from engine.command.context import Context
from engine.command.handler import Handler
from core.base.listener.event_rows import EventRows
from engine.repository.repository import Repository
from core.modules.helpers.support.program_change_access import ProgramChangeAccess
from suites.coding.modules.workers.commands.edit_worker_route.edit_worker_route import EditWorkerRoute
from suites.coding.modules.workers.models.worker_route import WorkerRoute


class EditWorkerRouteHandler(Handler[EditWorkerRoute, WorkerRoute]):
    """Checks who asked, then changes only the fields the command gives and saves the route."""

    command = EditWorkerRoute

    def __init__(self, rows: EventRows, repository: Repository, access: ProgramChangeAccess) -> None:
        self.rows, self.repository, self.access = rows, repository, access

    def handle(self, command: EditWorkerRoute, context: Context) -> WorkerRoute:
        self.access.check(context.actor)
        route = self.rows.required(WorkerRoute, command.row_id)
        return self.repository.update(route, context, **command.changed_fields())
