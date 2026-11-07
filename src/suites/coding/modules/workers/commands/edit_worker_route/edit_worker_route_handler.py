from core.base.command.context import Context
from core.base.command.handlers.edit_handler import EditHandler
from core.base.listener.event_rows import EventRows
from core.base.repository.repository import Repository
from core.modules.helpers.support.program_change_access import ProgramChangeAccess
from suites.coding.modules.workers.commands.edit_worker_route.edit_worker_route import EditWorkerRoute
from suites.coding.modules.workers.models.worker_route import WorkerRoute


class EditWorkerRouteHandler(EditHandler):
    """Checks who asked before using the shared edit handler."""

    command = EditWorkerRoute

    def __init__(self, rows: EventRows, repository: Repository, access: ProgramChangeAccess) -> None:
        super().__init__(rows, repository)
        self.access = access

    def handle(self, command: EditWorkerRoute, context: Context) -> WorkerRoute:
        self.access.check(context.actor)
        return super().handle(command, context)
